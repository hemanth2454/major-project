package com.skillx.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env from current directory or backend/ directory
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.ignoreIfMissing()
				.load();
		
		String env = System.getenv("ENVIRONMENT");
		boolean isProd = "production".equals(env) || "true".equals(System.getenv("RENDER"));

		if (isProd) {
			// In production, disable Flapdoodle and use external MongoDB Atlas URI
			System.setProperty("spring.autoconfigure.exclude", "de.flapdoodle.embed.mongo.spring.autoconfigure.EmbeddedMongoAutoConfiguration");
			String mongoUri = System.getenv("MONGO_URI");
			if (mongoUri == null || mongoUri.isEmpty()) {
				mongoUri = dotenv.get("MONGO_URI");
			}
			if (mongoUri == null || mongoUri.isEmpty()) {
				// Fallback to searching backend/.env if needed
				dotenv = Dotenv.configure().directory("./backend").ignoreIfMissing().load();
				mongoUri = dotenv.get("MONGO_URI");
			}
			
			if (mongoUri != null && !mongoUri.isEmpty()) {
				System.setProperty("spring.data.mongodb.uri", mongoUri);
			}
		}

		// Fix for DNS resolution issues with MongoDB Atlas on some Windows networks
		System.setProperty("java.net.preferIPv4Stack", "true");

		SpringApplication.run(BackendApplication.class, args);
	}

}
