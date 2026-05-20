import 'package:flutter/material.dart';

class Sidebar extends StatelessWidget {
  final Function(int) onItemSelected;
  final int selectedIndex;
  final VoidCallback onLogout;

  const Sidebar({
    super.key,
    required this.onItemSelected,
    required this.selectedIndex,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xFFFDFDFD),
      child: Column(
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF614f96), Color(0xFF7862ab)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.event, size: 64, color: Colors.white),
                  SizedBox(height: 12),
                  Text(
                    'ElMoultaqa',
                    style: TextStyle(
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
            title: 'Schedule',
            index: 1,
          ),
          _buildNavItem(
            context,
            icon: Icons.videocam_outlined,
            title: 'Live',
            index: 2,
          ),
          _buildNavItem(
            context,
            icon: Icons.person_outline,
            title: 'Profile',
            index: 3,
          ),
          const Spacer(),
          const Divider(),
          _buildNavItem(
            context,
            icon: Icons.settings_outlined,
            title: 'Settings',
            index: 4,
          ),
          ListTile(
            leading: const Icon(Icons.logout_outlined, color: Colors.grey),
            title: const Text('Logout', style: TextStyle(color: Colors.grey)),
            onTap: () {
              Navigator.pop(context);
              onLogout();
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
    final isSelected = selectedIndex == index;
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? const Color(0xFF614f96) : Colors.grey,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? const Color(0xFF614f96) : Colors.grey,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedTileColor: const Color(0xFFE6DFF2).withOpacity(0.2),
      onTap: () {
        onItemSelected(index);
        Navigator.pop(context);
      },
    );
  }
}
