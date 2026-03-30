# ====================================
# DATABASE CONFIGURATION - PostgreSQL
# ====================================
# Render will provide DATABASE_URL automatically
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver

# ====================================
# JPA / HIBERNATE CONFIGURATION
# ====================================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# ====================================
# EMAIL CONFIGURATION - Use Environment Variables
# ====================================
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.protocol=smtp
spring.mail.default-encoding=UTF-8
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
spring.mail.properties.mail.debug=false

# ====================================
# REDIS - DISABLE
# ====================================
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration

# ====================================
# FILE UPLOAD CONFIGURATION
# ====================================
app.upload-dir=/opt/render/project/src/uploads
spring.servlet.multipart.max-file-size=8MB
spring.servlet.multipart.max-request-size=32MB

# ====================================
# SERVER CONFIGURATION
# ====================================
server.port=${PORT:8080}
server.address=0.0.0.0
server.servlet.context-path=/
server.error.include-message=always
server.error.include-binding-errors=always

# ====================================
# CORS CONFIGURATION - Production URLs
# ====================================
app.frontend-url=${FRONTEND_URL:https://your-frontend.onrender.com}
app.cors.allowed-origin-patterns=${FRONTEND_URL},https://*.onrender.com

# ====================================
# JWT CONFIGURATION - Use Environment Variable
# ====================================
app.jwt-secret=${JWT_SECRET}
app.access-token-expiration=900000
app.refresh-token-expiration=604800000

# ====================================
# RAZORPAY CONFIGURATION
# ====================================
app.razorpay.key-id=${RAZORPAY_KEY_ID}
app.razorpay.key-secret=${RAZORPAY_KEY_SECRET}

# ====================================
# LOGGING CONFIGURATION
# ====================================
logging.level.org.springframework.security=INFO
logging.level.com.Clothing.Startup=INFO
logging.level.org.hibernate.SQL=WARN