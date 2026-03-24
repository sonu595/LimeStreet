package com.Clothing.Startup.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductImageStorageService {

    private final Path productUploadPath;

    public ProductImageStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) throws IOException {
        this.productUploadPath = Paths.get(uploadDir, "products").toAbsolutePath().normalize();
        Files.createDirectories(productUploadPath);
    }

    public List<String> storeImages(MultipartFile[] files) {
        List<String> storedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
            String extension = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : ".png";
            String fileName = UUID.randomUUID() + extension;
            Path targetPath = productUploadPath.resolve(fileName);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
                storedUrls.add("/uploads/products/" + fileName);
            } catch (IOException exception) {
                throw new RuntimeException("Failed to upload product image", exception);
            }
        }

        return storedUrls;
    }
}
