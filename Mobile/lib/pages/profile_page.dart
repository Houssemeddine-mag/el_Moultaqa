import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:convert';
import '../mobile_config.dart';

class ProfilePage extends StatefulWidget {
  final String userRole;
  final VoidCallback? onProfileCompleted;

  const ProfilePage({
    super.key,
    this.userRole = 'user',
    this.onProfileCompleted,
  });

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _organizationController = TextEditingController();
  bool _isEditing = false;
  bool _isLoading = true;
  bool _isSaving = false;

  String _displayName = 'Conference User';
  String _email = 'user@conference.com';
  String _organization = '';
  String _schoolLevel = '';
  String _gender = '';
  DateTime? _birthday;
  String _country = '';
  String _province = '';
  String? _profileImage;

  final ImagePicker _imagePicker = ImagePicker();

  late Color themeColor;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _organizationController.dispose();
    super.dispose();
  }

  Future<void> _loadUserProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userProfile = prefs.getString('user_profile');
      final themeColorHex = prefs.getString('elm_conference_config');

      setState(() {
        if (userProfile != null) {
          try {
            final profile = jsonDecode(userProfile);
            _displayName = profile['displayName'] ?? 'Conference User';
            _email = profile['email'] ?? 'user@conference.com';
            _organization = profile['organization'] ?? '';
            _schoolLevel = profile['schoolLevel'] ?? '';
            _gender = profile['gender'] ?? '';
            _profileImage = profile['profileImage'];
            _country = profile['country'] ?? '';
            _province = profile['province'] ?? '';
            if (profile['birthday'] != null) {
              _birthday = DateTime.tryParse(profile['birthday']);
            }
          } catch (e) {
            // Use defaults if parsing fails
          }
        }
        _nameController.text = _displayName;
        _emailController.text = _email;
        _organizationController.text = _organization;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _saveUserProfile() async {
    setState(() => _isSaving = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final profile = {
        'displayName': _nameController.text,
        'email': _emailController.text,
        'organization': _organization,
        'schoolLevel': _schoolLevel,
        'gender': _gender,
        'birthday': _birthday?.toIso8601String(),
        'country': _country,
        'province': _province,
        'profileImage': _profileImage,
      };
      await prefs.setString('user_profile', jsonEncode(profile));
      setState(() => _isEditing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile updated successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving profile: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => _isSaving = false);
    }
  }

  Future<void> _selectBirthday() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _birthday ?? DateTime(2000),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() => _birthday = picked);
    }
  }

  Future<void> _updateProfilePicture() async {
    final ImageSource? source = await showModalBottomSheet<ImageSource>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Update Profile Picture',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context, ImageSource.camera),
                  child: Column(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: themeColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Icon(
                          Icons.camera_alt,
                          size: 30,
                          color: themeColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Camera',
                        style: TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context, ImageSource.gallery),
                  child: Column(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: themeColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Icon(
                          Icons.photo_library,
                          size: 30,
                          color: themeColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Gallery',
                        style: TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );

    if (source != null) {
      try {
        final XFile? pickedFile = await _imagePicker.pickImage(
          source: source,
          maxWidth: 500,
          maxHeight: 500,
          imageQuality: 80,
        );

        if (pickedFile != null) {
          final bytes = await pickedFile.readAsBytes();
          final base64Image = base64Encode(bytes);
          setState(() => _profileImage = base64Image);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile picture updated!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error updating picture: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  String _getInitials(String name) {
    final parts = name.split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : 'U';
  }

  Color _getGenderColor() {
    if (_gender == 'Male') {
      return Colors.blue;
    } else if (_gender == 'Female') {
      return const Color(0xFFFF69B4); // Hot pink
    }
    // Get theme color if gender not set
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff' + raw.substring(1);
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff' + raw;
    }
    return Color(int.parse(hex));
  }

  @override
  Widget build(BuildContext context) {
    // Parse theme color from config
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff' + raw.substring(1);
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff' + raw;
    }
    themeColor = Color(int.parse(hex));

    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(themeColor),
        ),
      );
    }

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              'My Profile',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 20),

            // Profile Info Card
            _buildProfileInfo(themeColor),
            const SizedBox(height: 24),

            // Additional Information Card
            _buildAdditionalInfo(themeColor),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileInfo(Color themeColor) {
    return Card(
      elevation: 4,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Profile Picture
            GestureDetector(
              onTap: _isEditing ? _updateProfilePicture : null,
              child: Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: themeColor.withOpacity(0.1),
                      border: Border.all(
                        color: _getGenderColor(),
                        width: 3,
                      ),
                    ),
                    child: _profileImage != null && _profileImage!.isNotEmpty
                        ? ClipOval(
                            child: Image.memory(
                              base64Decode(_profileImage!),
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  _buildInitialsAvatar(themeColor),
                            ),
                          )
                        : _buildInitialsAvatar(themeColor),
                  ),
                  if (_isEditing)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: themeColor,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(
                          Icons.camera_alt,
                          size: 16,
                          color: Colors.white,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Display Name
            Text(
              _nameController.text.isNotEmpty
                  ? _nameController.text
                  : 'Conference User',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),

            // Email
            Text(
              _emailController.text.isNotEmpty
                  ? _emailController.text
                  : 'user@conference.com',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 20),

            // Profile Status Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _organization.isNotEmpty ? Colors.green : Colors.orange,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                _organization.isNotEmpty
                    ? 'Profile Complete'
                    : 'Profile Incomplete',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Edit/Save/Cancel Buttons
            if (!_isEditing)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => setState(() => _isEditing = true),
                  icon: const Icon(Icons.edit),
                  label: const Text('Edit Profile'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: themeColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              )
            else
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _isSaving ? null : _saveUserProfile,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: _isSaving
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : const Text('Save'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() => _isEditing = false);
                        _loadUserProfile();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Cancel'),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInitialsAvatar(Color themeColor) {
    return Container(
      width: 100,
      height: 100,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: themeColor,
      ),
      child: Center(
        child: Text(
          _getInitials(_nameController.text),
          style: const TextStyle(
            fontSize: 36,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildAdditionalInfo(Color themeColor) {
    bool hasAdditionalInfo = _organization.isNotEmpty ||
        _schoolLevel.isNotEmpty ||
        _gender.isNotEmpty ||
        _birthday != null ||
        _country.isNotEmpty;

    return Card(
      elevation: 4,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Additional Information',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 16),
            if (!_isEditing && !hasAdditionalInfo)
              Text(
                'No additional information added yet. Click "Edit Profile" to add details.',
                style: TextStyle(color: Colors.grey[600]),
              )
            else if (!_isEditing)
              Column(
                children: [
                  if (_organization.isNotEmpty)
                    _buildInfoRow('Organization', _organization),
                  if (_organization.isNotEmpty && _schoolLevel.isNotEmpty)
                    const SizedBox(height: 12),
                  if (_schoolLevel.isNotEmpty)
                    _buildInfoRow('Education Level', _schoolLevel),
                  if (_schoolLevel.isNotEmpty && _gender.isNotEmpty)
                    const SizedBox(height: 12),
                  if (_gender.isNotEmpty) _buildInfoRow('Gender', _gender),
                  if (_gender.isNotEmpty && _birthday != null)
                    const SizedBox(height: 12),
                  if (_birthday != null)
                    _buildInfoRow(
                      'Birthday',
                      '${_birthday!.day}/${_birthday!.month}/${_birthday!.year}',
                    ),
                  if (_birthday != null && _country.isNotEmpty)
                    const SizedBox(height: 12),
                  if (_country.isNotEmpty) _buildInfoRow('Country', _country),
                  if (_country.isNotEmpty && _province.isNotEmpty)
                    const SizedBox(height: 12),
                  if (_province.isNotEmpty)
                    _buildInfoRow('Province', _province),
                ],
              )
            else
              Column(
                children: [
                  // Organization
                  TextField(
                    controller: _organizationController,
                    onChanged: (value) => setState(() => _organization = value),
                    decoration: InputDecoration(
                      labelText: 'Organization',
                      labelStyle: TextStyle(color: themeColor),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: themeColor),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Education Level Dropdown
                  DropdownButtonFormField<String>(
                    value: _schoolLevel.isNotEmpty ? _schoolLevel : null,
                    items: [
                      'High School',
                      'Bachelor',
                      'Master',
                      'PhD',
                    ]
                        .map((level) => DropdownMenuItem(
                              value: level,
                              child: Text(level),
                            ))
                        .toList(),
                    onChanged: (value) =>
                        setState(() => _schoolLevel = value ?? ''),
                    decoration: InputDecoration(
                      labelText: 'Education Level',
                      labelStyle: TextStyle(color: themeColor),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: themeColor),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Gender Dropdown
                  DropdownButtonFormField<String>(
                    value: _gender.isNotEmpty ? _gender : null,
                    items: ['Male', 'Female', 'Other']
                        .map((gender) => DropdownMenuItem(
                              value: gender,
                              child: Text(gender),
                            ))
                        .toList(),
                    onChanged: (value) => setState(() => _gender = value ?? ''),
                    decoration: InputDecoration(
                      labelText: 'Gender',
                      labelStyle: TextStyle(color: themeColor),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: themeColor),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Birthday
                  GestureDetector(
                    onTap: _selectBirthday,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _birthday == null
                                ? 'Select Birthday'
                                : '${_birthday!.day}/${_birthday!.month}/${_birthday!.year}',
                            style: TextStyle(
                              color: _birthday == null
                                  ? Colors.grey
                                  : Colors.black,
                            ),
                          ),
                          Icon(Icons.calendar_today, color: themeColor),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Country Dropdown
                  DropdownButtonFormField<String>(
                    value: _country.isNotEmpty ? _country : null,
                    items: [
                      'Algeria',
                      'Tunisia',
                      'Morocco',
                      'Egypt',
                      'Libya',
                      'Other'
                    ]
                        .map((country) => DropdownMenuItem(
                              value: country,
                              child: Text(country),
                            ))
                        .toList(),
                    onChanged: (value) {
                      setState(() {
                        _country = value ?? '';
                        if (_country != 'Algeria') {
                          _province = '';
                        }
                      });
                    },
                    decoration: InputDecoration(
                      labelText: 'Country',
                      labelStyle: TextStyle(color: themeColor),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: themeColor),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Province (only for Algeria)
                  if (_country == 'Algeria')
                    DropdownButtonFormField<String>(
                      value: _province.isNotEmpty ? _province : null,
                      items: [
                        'Algiers',
                        'Blida',
                        'Bouira',
                        'Tlemcen',
                        'Oran',
                        'Constantine'
                      ]
                          .map((province) => DropdownMenuItem(
                                value: province,
                                child: Text(province),
                              ))
                          .toList(),
                      onChanged: (value) =>
                          setState(() => _province = value ?? ''),
                      decoration: InputDecoration(
                        labelText: 'Province/Wilaya',
                        labelStyle: TextStyle(color: themeColor),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: themeColor),
                        ),
                      ),
                    ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF6B7280),
            fontWeight: FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
