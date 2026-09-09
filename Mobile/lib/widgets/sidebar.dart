import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../mobile_config.dart';
import '../services/supabase_service.dart';
import '../theme_utils.dart';

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
    try {
      final config = await SupabaseService.getConferenceConfig();
      if (config != null && config['name'] != null && (config['name'] as String).isNotEmpty) {
        setState(() {
          _conferenceName = config['name'] as String;
        });
        return;
      }
    } catch (_) {}

    setState(() {
      _conferenceName = MobileConfig.heroTitle;
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
      child: Column(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  MobileConfig.parsedThemeColor,
                  lightenColor(MobileConfig.parsedThemeColor),
                ],
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
                    child: MobileConfig.logoUrl.isNotEmpty
                        ? Image.network(
                            MobileConfig.logoUrl,
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stackTrace) {
                              return Image.asset(
                                'assets/images/logo.png',
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) {
                                  return const Icon(
                                    Icons.event,
                                    size: 64,
                                    color: Colors.white,
                                  );
                                },
                              );
                            },
                          )
                        : Image.asset(
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
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
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
              ],
            ),
          ),
          const Divider(height: 1),
          _buildNavItem(
            context,
            icon: Icons.settings_outlined,
            title: 'Settings',
            index: 4,
          ),
          ListTile(
            leading: Icon(Icons.language, color: MobileConfig.parsedThemeColor),
            title: Text(
              'Visit WebApp',
              style: TextStyle(
                color: MobileConfig.parsedThemeColor,
                fontWeight: FontWeight.w600,
              ),
            ),
            onTap: () {
              _launchWebApp();
              Navigator.pop(context);
            },
          ),
          const SizedBox(height: 8),
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
        color: isSelected ? MobileConfig.parsedThemeColor : Colors.grey,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? MobileConfig.parsedThemeColor : Colors.grey,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedTileColor: MobileConfig.parsedThemeColor.withValues(alpha: 0.1),
      onTap: () {
        widget.onItemSelected(index);
      },
    );
  }
}
