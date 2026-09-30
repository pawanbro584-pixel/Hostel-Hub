const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabase');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Only JPEG, JPG, PNG, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

const uploadToSupabase = async (fileBuffer, originalName, mimeType) => {
  if (!supabase) {
    // Mock Supabase fallback if unconfigured
    const mockFileName = `mock_${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
    return `https://via.placeholder.com/600x400.png?text=HostelHub+Room+Image+(${encodeURIComponent(mockFileName)})`;
  }

  const fileExt = path.extname(originalName) || '.jpg';
  const fileName = `room_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExt}`;
  const bucketName = process.env.SUPABASE_BUCKET || 'hostel-room-images';

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

module.exports = {
  uploadSingle: upload.single('image'),
  uploadToSupabase
};
