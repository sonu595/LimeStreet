package com.Startup.Ecommerce.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Only image files are allowed");
        }
        
        // Validate file size (5MB max)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IOException("File size exceeds 5MB limit");
        }
        
        // Create products subfolder
        Path uploadPath = Paths.get(uploadDir, "products");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;
        
        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        
        // Return URL
        return "/uploads/products/" + filename;
    }
    
    public String saveBase64Image(String base64Data) throws IOException {
        if (base64Data == null || base64Data.isEmpty()) {
            throw new IOException("Base64 data is empty");
        }
        
        // Remove data:image/png;base64, prefix if present
        String[] parts = base64Data.split(",");
        String imageData = parts.length > 1 ? parts[1] : parts[0];
        
        // Decode Base64 to bytes
        byte[] imageBytes = java.util.Base64.getDecoder().decode(imageData);
        
        // Detect file extension from base64 header
        String extension = "jpg";
        if (base64Data.contains("data:image/png")) {
            extension = "png";
        } else if (base64Data.contains("data:image/gif")) {
            extension = "gif";
        } else if (base64Data.contains("data:image/webp")) {
            extension = "webp";
        } else if (base64Data.contains("data:image/jpeg")) {
            extension = "jpg";
        }
        
        // Create products subfolder
        Path uploadPath = Paths.get(uploadDir, "products");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate filename
        String filename = UUID.randomUUID().toString() + "." + extension;
        Path filePath = uploadPath.resolve(filename);
        
        // Save file
        Files.write(filePath, imageBytes);
        
        return "/uploads/products/" + filename;
    }
    
    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, "products", filename);
            Files.deleteIfExists(filePath);
            System.out.println("Deleted image: " + filename);
        }
    }
}