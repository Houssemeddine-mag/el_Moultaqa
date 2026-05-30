import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Sidebar extends StatefulWidget {
  final Function(int) onItemSelected;
  final int selectedIndex;
  final VoidCallback? onDisconnectRequested;

  const Sidebar({
    Key? key,
    required this.onItemSelected,
    required this.selectedIndex,
    this.onDisconnectRequested,
  }) : super(key: key);

  @override
  State<Sidebar> createState() => _SidebarState();
}

class _SidebarState extends State<Sidebar> {
  String _conferenceName = 'ElMoultaqa';

  @override
  void initState() {
    super.initState();
    _loadConferenceName();
  }

  Future<void> _loadConferenceName() async {
    final prefs = await SharedPreferences.getInstance();
    final config = prefs.getString('elm_conference_config');
    if (config != null) {
      try {
        // Parse JSON to extract name
        final jsonStr = config;
        final nameMatch = RegExp(r'"name"\s*:\s*"([^"]*)"').firstMatch(jsonStr);
        if (nameMatch != null && nameMatch.group(1)!.isNotEmpty) {
          setState(() {
            _conferenceName = nameMatch.group(1)!;
          });
          return;
        }
      } catch (e) {
        // Fallback to default
      }
    }
    setState(() {
      _conferenceName = 'ElMoultaqa';
    });
  }

  void _launchWebApp() async {
    const url = 'https://elmoultaqa.com'; // Replace with actual webapp URL
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xFFFDFDFD),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF0D7E52), Color(0xFF1FB69A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 80,
                    height: 80,
                    child: Image.asset(
                      'assets/images/logo.png',
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(
                          Icons.event,
                          size: 64,
                          color: Colors.white,
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _conferenceName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          _buildNavItem(
            context,
            icon: Icons.home_outlined,
            title: 'Home',
            index: 0,
          ),
          _buildNavItem(
            context,
            icon: Icons.calendar_month_outlined,
            title: 'Program',
            index: 1,
          ),
          _buildNavItem(
            context,
            icon: Icons.videocam_outlined,
            title: 'Live Stream',
            index: 2,
          ),
          _buildNavItem(
            context,
            icon: Icons.person_outline,
            title: 'Profile',
            index: 3,
          ),
          const Divider(),
          _buildNavItem(
            context,
            icon: Icons.settings_outlined,
            title: 'Settings',
            index: 4,
          ),
          ListTile(
            leading: const Icon(Icons.language, color: Color(0xFF0D7E52)),
            title: const Text(
              'Visit WebApp',
              style: TextStyle(
                color: Color(0xFF0D7E52),
                fontWeight: FontWeight.w600,
              ),
            ),
            onTap: () {
              _launchWebApp();
              Navigator.pop(context);
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required int index,
  }) {
    final isSelected = widget.selectedIndex == index;
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? const Color(0xFF0D7E52) : Colors.grey,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? const Color(0xFF0D7E52) : Colors.grey,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedTileColor: const Color(0xFF0D7E52).withOpacity(0.1),
      onTap: () {
        widget.onItemSelected(index);
      },
    );
  }
}
