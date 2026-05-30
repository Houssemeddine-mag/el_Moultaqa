# ElMoultaqa Mobile App - Updated Structure

This is the migrated ElMoultaqa mobile app based on the RIF app's excellent UI/UX architecture, with the ElMoultaqa green theme preserved.

## 🎨 Theme

The app uses **ElMoultaqa's green theme** (`#0D7E52` primary color) throughout. All RIF components have been adapted to use this color scheme.

## 📱 App Structure

### Pages
- **Home Page** (`pages/home_page.dart`) - Dashboard with countdown, upcoming sessions, stats, and quick action buttons
  - Includes **Keynote Speakers** button
  - Includes **Go Live** button for live stream
  - Includes **Webapp** button to launch the web version
- **Program Page** (`pages/program_page.dart`) - Conference schedule with day tabs
- **Keynote Speakers Page** (`pages/keynote_speakers_page.dart`) - Featured speakers with detailed bios
- **RIF Live Page** (`pages/direct_page.dart`) - Live stream viewing and Q&A interaction
- **Profile Page** (`pages/profile_page.dart`) - User profile management
- **Settings Page** (`pages/settings_page.dart`) - App settings and preferences
- **Auth Page** (`pages/auth_page.dart`) - Authentication

### Widgets
- **Sidebar** (`widgets/sidebar.dart`) - Main navigation drawer with logo
- **Notification Bell** (`widgets/notification_bell.dart`) - Notification indicator

## 🚀 Key Features

### Home Page Quick Actions
The home page now includes four primary action buttons:
1. **Keynotes** - View featured keynote speakers
2. **Program** - Access conference schedule
3. **Go Live** - Watch live stream and participate in Q&A
4. **Webapp** - Launch the ElMoultaqa web application

### Navigation
- **Bottom Navigation Bar** - Quick access to all major sections
- **Sidebar Drawer** - Full navigation with "Visit WebApp" option
- **WebApp Integration** - Link to web version can be configured in the code

## 🎯 Main Updates from Previous Version

1. ✅ **RIF App Architecture** - Imported component structure and design patterns
2. ✅ **Green Theme** - All purple RIF colors converted to ElMoultaqa green
3. ✅ **New Pages** - Added Keynote Speakers page and Live page (Direct)
4. ✅ **Webapp Button** - Quick access to web version throughout the app
5. ✅ **Updated Sidebar** - Now includes logo placeholder and webapp link
6. ✅ **Improved Home** - Interactive dashboard with stats and upcoming events
7. ✅ **Consistent Theme** - All pages use the green color scheme

## 📋 Setup Instructions

### 1. Copy the ElMoultaqa Logo
Copy the logo from: `desktop/ElMoultaqa/global/logo.png`
Paste it to: `assets/images/logo.png` in this project

The app will automatically fall back to a default icon if the logo is not found.

### 2. Configure Dependencies
Update your `pubspec.yaml` with required packages:
```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  url_launcher: ^6.1.0
  firebase_core: ^24.0.0
  firebase_auth: ^4.10.0
  cloud_firestore: ^4.13.0
  firebase_messaging: ^14.6.0
```

Run: `flutter pub get`

### 3. Configure WebApp URL
Edit `pages/home_page.dart` and `widgets/sidebar.dart`:
Replace `https://elmoultaqa.com` with your actual webapp URL

### 4. Firebase Setup (Optional)
If integrating with Firebase:
- Create `lib/firebase_options.dart` with your Firebase configuration
- Uncomment Firebase imports in `lib/main.dart` if needed

### 5. Colors Reference
- **Primary Green**: `#0D7E52` (Color(0xFF0D7E52))
- **Secondary Green**: `#1FB69A` (Color(0xFF1FB69A))
- **Background**: `#EEECF4` (Light green tint)
- **Text Dark**: `#2d2d2d`
- **Text Light**: `#6B7280`

## 🔄 Navigation Structure

```
Main Layout
├── Home (index 0)
├── Program (index 1)
├── Keynote Speakers (index 2)
├── RIF Live (index 3)
├── Profile (index 4)
└── Settings (index 5)
```

## 📲 Quick Links

### Webapp Access
The webapp can be accessed from:
1. Home page "Webapp" button
2. Sidebar "Visit WebApp" menu option
3. Direct link in configuration

## 🛠️ Customization

### To Change App Name
Edit `mobile_config.dart`:
```dart
static const String appName = 'ElMoultaqa Mobile';
```

### To Change Colors
Edit `theme.dart` to modify the primary color used throughout the app.

### To Add More Pages
1. Create new page in `pages/` directory
2. Add to `main.dart` MainLayout's `_pages` list
3. Add corresponding navigation item in sidebar

## 📝 Files Changed

- `lib/main.dart` - Complete rewrite with RIF architecture
- `lib/theme.dart` - New, uses green theme
- `lib/pages/home_page.dart` - Redesigned with quick actions
- `lib/pages/keynote_speakers_page.dart` - New page based on RIF
- `lib/pages/direct_page.dart` - New live page based on RIF
- `lib/pages/profile_page.dart` - Updated with StatefulWidget
- `lib/pages/settings_page.dart` - Updated design
- `lib/widgets/sidebar.dart` - Updated with logo and webapp link
- `lib/widgets/notification_bell.dart` - New widget
- `pubspec.yaml` - Updated dependencies and assets

## 🐛 Troubleshooting

### Logo Not Showing
Make sure the logo is copied to `assets/images/logo.png`. The app has a fallback icon.

### Webapp Button Not Working
Check that `url_launcher` package is installed and the URL is correctly configured.

### Theme Not Applied
Ensure all imports are correct and `AppTheme.theme` is being used in MaterialApp.

## 📞 Support

For issues or questions, refer to:
- RIF app structure in `d:\career\Projects\rif2.0\rifrif`
- Flutter documentation: https://flutter.dev

---

**Version**: 1.0.0  
**Last Updated**: May 25, 2026  
**Theme**: ElMoultaqa Green (#0D7E52)
