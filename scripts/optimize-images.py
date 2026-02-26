#!/usr/bin/env python3
"""
Image Optimization Script for Zephyr Learning System

This script optimizes images in the docs/assets/images directory:
- Compresses PNG and JPEG images (requires Pillow)
- Optimizes SVG files (built-in)
- Reports file size savings

Usage:
    python scripts/optimize-images.py
    python scripts/optimize-images.py --dry-run
    python scripts/optimize-images.py --target-dir docs/assets/images/hardware

Note: For full image optimization (PNG/JPEG), install Pillow:
    pip install pillow
    
    On Windows, you may need to install pre-built wheels:
    pip install pillow --only-binary :all:
"""

import os
import sys
import argparse
from pathlib import Path
from typing import List, Tuple

# Try to import Pillow, but make it optional
try:
    from PIL import Image
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("Warning: Pillow not installed. PNG/JPEG optimization will be skipped.")
    print("To enable full optimization, install Pillow:")
    print("  pip install pillow --only-binary :all:")
    print()

import xml.etree.ElementTree as ET


class ImageOptimizer:
    """Optimize images for web delivery"""
    
    def __init__(self, dry_run: bool = False, verbose: bool = False):
        self.dry_run = dry_run
        self.verbose = verbose
        self.stats = {
            'processed': 0,
            'skipped': 0,
            'errors': 0,
            'original_size': 0,
            'optimized_size': 0
        }
    
    def optimize_directory(self, directory: Path) -> None:
        """Optimize all images in a directory"""
        print(f"Scanning directory: {directory}")
        
        image_files = []
        for ext in ['*.png', '*.jpg', '*.jpeg', '*.svg']:
            image_files.extend(directory.rglob(ext))
        
        if not image_files:
            print("No images found to optimize.")
            return
        
        print(f"Found {len(image_files)} images to process.\n")
        
        for image_path in image_files:
            self.optimize_image(image_path)
        
        self.print_summary()
    
    def optimize_image(self, image_path: Path) -> None:
        """Optimize a single image"""
        try:
            if image_path.suffix.lower() == '.svg':
                self.optimize_svg(image_path)
            elif image_path.suffix.lower() in ['.png', '.jpg', '.jpeg']:
                if PILLOW_AVAILABLE:
                    self.optimize_raster(image_path)
                else:
                    print(f"⊘ {image_path.name}: Skipped (Pillow not installed)")
                    self.stats['skipped'] += 1
        except Exception as e:
            print(f"❌ Error processing {image_path.name}: {e}")
            self.stats['errors'] += 1
    
    def optimize_svg(self, svg_path: Path) -> None:
        """Optimize SVG file"""
        original_size = svg_path.stat().st_size
        self.stats['original_size'] += original_size
        
        if self.verbose:
            print(f"Processing SVG: {svg_path.name}")
        
        try:
            # Parse SVG
            tree = ET.parse(svg_path)
            root = tree.getroot()
            
            # Remove comments and metadata
            for element in root.iter():
                if element.tag.endswith('metadata') or element.tag.endswith('comment'):
                    root.remove(element)
            
            # Remove unnecessary attributes
            unnecessary_attrs = ['id', 'inkscape:version', 'sodipodi:docname']
            for element in root.iter():
                for attr in unnecessary_attrs:
                    if attr in element.attrib:
                        del element.attrib[attr]
            
            if not self.dry_run:
                # Write optimized SVG
                tree.write(svg_path, encoding='utf-8', xml_declaration=True)
            
            optimized_size = svg_path.stat().st_size if not self.dry_run else original_size
            self.stats['optimized_size'] += optimized_size
            self.stats['processed'] += 1
            
            savings = original_size - optimized_size
            savings_pct = (savings / original_size * 100) if original_size > 0 else 0
            
            if savings > 0:
                print(f"✓ {svg_path.name}: {self.format_size(original_size)} → "
                      f"{self.format_size(optimized_size)} "
                      f"(saved {self.format_size(savings)}, {savings_pct:.1f}%)")
            else:
                print(f"○ {svg_path.name}: Already optimized ({self.format_size(original_size)})")
                self.stats['skipped'] += 1
        
        except Exception as e:
            print(f"❌ Error optimizing SVG {svg_path.name}: {e}")
            self.stats['errors'] += 1
    
    def optimize_raster(self, image_path: Path) -> None:
        """Optimize PNG/JPEG image"""
        original_size = image_path.stat().st_size
        self.stats['original_size'] += original_size
        
        if self.verbose:
            print(f"Processing {image_path.suffix.upper()}: {image_path.name}")
        
        try:
            # Open image
            img = Image.open(image_path)
            
            # Check if image is too large
            max_dimension = 2000
            if img.width > max_dimension or img.height > max_dimension:
                # Resize while maintaining aspect ratio
                ratio = min(max_dimension / img.width, max_dimension / img.height)
                new_size = (int(img.width * ratio), int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                print(f"  Resized from {image_path.stat().st_size} to {new_size}")
            
            # Optimize based on format
            if image_path.suffix.lower() == '.png':
                # Optimize PNG
                if not self.dry_run:
                    img.save(image_path, 'PNG', optimize=True, compress_level=9)
            else:
                # Optimize JPEG
                if not self.dry_run:
                    # Convert RGBA to RGB if necessary
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    img.save(image_path, 'JPEG', quality=85, optimize=True, progressive=True)
            
            # Generate WebP version
            webp_path = image_path.with_suffix('.webp')
            if not self.dry_run:
                img.save(webp_path, 'WEBP', quality=80, method=6)
                print(f"  Generated WebP: {webp_path.name} ({self.format_size(webp_path.stat().st_size)})")
            
            optimized_size = image_path.stat().st_size if not self.dry_run else original_size
            self.stats['optimized_size'] += optimized_size
            self.stats['processed'] += 1
            
            savings = original_size - optimized_size
            savings_pct = (savings / original_size * 100) if original_size > 0 else 0
            
            # Check if image is too large
            if optimized_size > 200 * 1024:  # 200KB
                print(f"⚠️  {image_path.name}: {self.format_size(original_size)} → "
                      f"{self.format_size(optimized_size)} "
                      f"(WARNING: Still > 200KB)")
            elif savings > 0:
                print(f"✓ {image_path.name}: {self.format_size(original_size)} → "
                      f"{self.format_size(optimized_size)} "
                      f"(saved {self.format_size(savings)}, {savings_pct:.1f}%)")
            else:
                print(f"○ {image_path.name}: Already optimized ({self.format_size(original_size)})")
                self.stats['skipped'] += 1
        
        except Exception as e:
            print(f"❌ Error optimizing {image_path.name}: {e}")
            self.stats['errors'] += 1
    
    def print_summary(self) -> None:
        """Print optimization summary"""
        print("\n" + "=" * 60)
        print("OPTIMIZATION SUMMARY")
        print("=" * 60)
        print(f"Processed: {self.stats['processed']}")
        print(f"Skipped:   {self.stats['skipped']}")
        print(f"Errors:    {self.stats['errors']}")
        print(f"\nOriginal size:  {self.format_size(self.stats['original_size'])}")
        print(f"Optimized size: {self.format_size(self.stats['optimized_size'])}")
        
        if self.stats['original_size'] > 0:
            total_savings = self.stats['original_size'] - self.stats['optimized_size']
            savings_pct = (total_savings / self.stats['original_size'] * 100)
            print(f"Total savings:  {self.format_size(total_savings)} ({savings_pct:.1f}%)")
        
        if self.dry_run:
            print("\n⚠️  DRY RUN: No files were modified")
        
        print("=" * 60)
    
    @staticmethod
    def format_size(size_bytes: int) -> str:
        """Format file size in human-readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} TB"


def main():
    parser = argparse.ArgumentParser(
        description='Optimize images for Zephyr Learning System'
    )
    parser.add_argument(
        '--target-dir',
        type=Path,
        default=Path('docs/assets/images'),
        help='Target directory to optimize (default: docs/assets/images)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be done without making changes'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed processing information'
    )
    
    args = parser.parse_args()
    
    # Validate target directory
    if not args.target_dir.exists():
        print(f"Error: Directory not found: {args.target_dir}")
        sys.exit(1)
    
    if not args.target_dir.is_dir():
        print(f"Error: Not a directory: {args.target_dir}")
        sys.exit(1)
    
    # Run optimization
    optimizer = ImageOptimizer(dry_run=args.dry_run, verbose=args.verbose)
    optimizer.optimize_directory(args.target_dir)


if __name__ == '__main__':
    main()
