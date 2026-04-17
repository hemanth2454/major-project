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
		
		String mongoUri = dotenv.get("MONGO_URI");
		
		// If not found in current directory, try backend/ (useful when running from root)
		if (mongoUri == null || mongoUri.isEmpty()) {
			dotenv = Dotenv.configure()
					.directory("./backend")
					.ignoreIfMissing()
					.load();
			mongoUri = dotenv.get("MONGO_URI");
		}

		if (mongoUri != null) {
			System.setProperty("MONGO_URI", mongoUri);
		}

		// Fix for DNS resolution issues with MongoDB Atlas on some Windows networks
		System.setProperty("java.net.preferIPv4Stack", "true");

		SpringApplication.run(BackendApplication.class, args);
	}

}
