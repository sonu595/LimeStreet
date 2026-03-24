package com.Clothing.Startup.Service;

import java.time.Duration;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    private final StringRedisTemplate redisTemplate;
    private final ConcurrentMap<String, String> fallbackOtpStorage = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Long> fallbackExpiryStorage = new ConcurrentHashMap<>();

    public OtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void storeOtp(String email, String otp) {
        String key = getOtpKey(email);

        try {
            redisTemplate.opsForValue().set(key, otp, OTP_TTL);
            clearLocalOtp(key);
        } catch (Exception redisError) {
            logger.warn("Redis unavailable while storing OTP. Falling back to in-memory storage.");
            fallbackOtpStorage.put(key, otp);
            fallbackExpiryStorage.put(key, System.currentTimeMillis() + OTP_TTL.toMillis());
        }
    }

    public Optional<String> getOtp(String email) {
        String key = getOtpKey(email);

        try {
            String otp = redisTemplate.opsForValue().get(key);

            if (otp != null) {
                return Optional.of(otp);
            }
        } catch (Exception redisError) {
            logger.warn("Redis unavailable while reading OTP. Using in-memory fallback.");
        }

        return getLocalOtp(key);
    }

    public void clearOtp(String email) {
        String key = getOtpKey(email);

        try {
            redisTemplate.delete(key);
        } catch (Exception redisError) {
            logger.warn("Redis unavailable while clearing OTP. Clearing in-memory fallback only.");
        }

        clearLocalOtp(key);
    }

    public boolean hasOtp(String email) {
        String key = getOtpKey(email);

        try {
            Boolean exists = redisTemplate.hasKey(key);

            if (Boolean.TRUE.equals(exists)) {
                return true;
            }
        } catch (Exception redisError) {
            logger.warn("Redis unavailable while checking OTP status. Using in-memory fallback.");
        }

        return getLocalOtp(key).isPresent();
    }

    public long getTimeLeftSeconds(String email) {
        String key = getOtpKey(email);

        try {
            Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);

            if (ttl != null && ttl >= 0) {
                return ttl;
            }
        } catch (Exception redisError) {
            logger.warn("Redis unavailable while reading OTP TTL. Using in-memory fallback.");
        }

        Long expiry = fallbackExpiryStorage.get(key);

        if (expiry == null) {
            return 0;
        }

        long remainingMillis = expiry - System.currentTimeMillis();

        if (remainingMillis <= 0) {
            clearLocalOtp(key);
            return 0;
        }

        return TimeUnit.MILLISECONDS.toSeconds(remainingMillis);
    }

    private String getOtpKey(String email) {
        return "auth:otp:" + email.trim().toLowerCase(Locale.ROOT);
    }

    private Optional<String> getLocalOtp(String key) {
        Long expiry = fallbackExpiryStorage.get(key);

        if (expiry == null) {
            return Optional.empty();
        }

        if (System.currentTimeMillis() > expiry) {
            clearLocalOtp(key);
            return Optional.empty();
        }

        return Optional.ofNullable(fallbackOtpStorage.get(key));
    }

    private void clearLocalOtp(String key) {
        fallbackOtpStorage.remove(key);
        fallbackExpiryStorage.remove(key);
    }
}
