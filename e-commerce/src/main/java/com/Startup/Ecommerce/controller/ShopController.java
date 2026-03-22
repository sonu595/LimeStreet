package com.Startup.Ecommerce.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Startup.Ecommerce.Service.ShopService;
import com.Startup.Ecommerce.dto.request.ShopStateRequest;
import com.Startup.Ecommerce.dto.response.ApiResponse;
import com.Startup.Ecommerce.dto.response.ShopStateResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/state")
    public ResponseEntity<ApiResponse<ShopStateResponse>> getState(Principal principal) {
        ShopStateResponse response = shopService.getState(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Shop state fetched successfully", response));
    }

    @PutMapping("/state")
    public ResponseEntity<ApiResponse<ShopStateResponse>> updateState(
            Principal principal,
            @RequestBody ShopStateRequest request
    ) {
        ShopStateResponse response = shopService.updateState(principal.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Shop state updated successfully", response));
    }
}
