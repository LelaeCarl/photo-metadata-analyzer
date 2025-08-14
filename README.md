# Photo Metadata Analyzer

A modern, responsive web application for extracting and analyzing metadata from images. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🖼️ Image Upload & Processing
- **Drag & Drop**: Intuitive drag-and-drop interface for uploading images
- **Batch Upload**: Process multiple images simultaneously
- **Multiple Formats**: Supports JPEG, PNG, HEIC, RAW, and more
- **Real-time Processing**: Live status updates during metadata extraction

### 📊 Metadata Extraction
- **EXIF Data**: Camera make & model, aperture, shutter speed, ISO, focal length, lens info
- **GPS Coordinates**: Location data with map integration
- **IPTC Data**: Caption, keywords, copyright, creator information
- **XMP Data**: Adobe-specific metadata, ratings, color labels
- **Basic Info**: File size, dimensions, format, resolution

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Cards**: Expandable metadata sections with smooth animations
- **Grid/List Views**: Switch between different viewing modes
- **Search & Filter**: Find images by filename, camera, or metadata content

### 📈 Analytics & Visualization
- **Statistics Panel**: Overview of image collection statistics
- **Filter System**: Filter by date range, camera model, GPS data, categories
- **Export Options**: Export metadata in JSON, CSV, or TXT formats
- **Data Visualization**: Charts and graphs for camera settings distribution

### 🔒 Privacy-Focused
- **Client-Side Processing**: All metadata extraction happens in your browser
- **No Server Storage**: Your images never leave your device
- **Local Processing**: Fast and secure metadata analysis

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Metadata Extraction**: exifr library for comprehensive EXIF/IPTC/XMP parsing
- **Build Tool**: Vite for fast development and optimized builds
- **Icons**: Lucide React for consistent iconography

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metadata-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Step 1: Upload Images
- Drag and drop images onto the upload area, or click to select files
- Supported formats: JPEG, PNG, HEIC, RAW, TIFF, WebP, and more
- Multiple images can be uploaded simultaneously

### Step 2: View Metadata
- Images are automatically processed and metadata is extracted
- View basic information, EXIF data, GPS coordinates, and more
- Expand/collapse sections to focus on specific metadata types

### Step 3: Filter & Search
- Use the filter panel to narrow down images by:
  - Date range
  - Camera model
  - GPS data availability
  - EXIF data availability
  - Categories
- Search by filename, camera make/model, or caption text

### Step 4: Export Data
- Choose from three export formats:
  - **JSON**: Complete structured data
  - **CSV**: Tabular format for spreadsheet analysis
  - **TXT**: Human-readable text format
- Click "Export" to download the metadata file

### Step 5: Analyze Statistics
- View collection statistics in the sidebar
- See format distribution, camera usage, and date ranges
- Monitor GPS data coverage and average ratings

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header with dark mode toggle
│   ├── FileUpload.tsx  # Drag & drop file upload component
│   ├── MetadataGrid.tsx # Main grid/list view of images
│   ├── MetadataCard.tsx # Individual image metadata card
│   ├── FilterPanel.tsx # Filtering and search controls
│   ├── StatsPanel.tsx  # Statistics and analytics
│   ├── ExportPanel.tsx # Export functionality
│   └── MapView.tsx     # GPS coordinate display
├── types/              # TypeScript type definitions
│   └── metadata.ts     # Metadata interfaces
├── utils/              # Utility functions
│   ├── metadataExtractor.ts # EXIF/IPTC/XMP extraction
│   ├── exportUtils.ts  # Export functionality
│   └── filterUtils.ts  # Filtering and statistics
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Customization

### Adding New Metadata Fields
1. Update the interfaces in `src/types/metadata.ts`
2. Modify the extraction logic in `src/utils/metadataExtractor.ts`
3. Update the display components to show the new fields

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles are in the respective component files

### Export Formats
- Add new export formats in `src/utils/exportUtils.ts`
- Update the `ExportPanel` component to include new options

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- **Large Collections**: For collections with 100+ images, consider processing in batches
- **Memory Usage**: The app processes images in memory, so very large images may impact performance
- **Export**: Large exports are processed in chunks to prevent browser freezing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [exifr](https://github.com/MikeKovarik/exifr) - Excellent EXIF/IPTC/XMP parsing library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon library
- [React](https://reactjs.org/) - JavaScript library for building user interfaces

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure your images contain metadata (some images may have been stripped of EXIF data)
3. Try with different image formats
4. Open an issue on GitHub with details about the problem

---

**Note**: This application processes images entirely in your browser. No data is sent to external servers, ensuring your privacy and security.
