package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

public class ImportStoresTest {
	private WebDriver driver;
	private String baseUrl;
	private String filePath;
	private boolean acceptNextAlert = true;
	private StringBuffer verificationErrors = new StringBuffer();

	@Before
	public void setUp() throws Exception {
		driver = new FirefoxDriver();
		baseUrl = "file:///Users/sj/capstone/index.html";
		filePath = "/Users/sj/capstone/UBC ECE Capstone Project - Nodes.csv";
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	}

	@Test
	public void testImportStores() throws Exception {
		driver.get(baseUrl);
		JavascriptExecutor jsx = (JavascriptExecutor) driver;
		jsx.executeScript("document.getElementById('upload-wrap').style.display = 'block';");
		WebElement fileInput = driver.findElement(By
				.xpath("//input[@type='file']"));
		fileInput.sendKeys(filePath);
		assertEquals("25 stores imported!", closeAlertAndGetItsText());
		driver.findElement(By.id("sub_id0")).click();
		driver.findElement(By.id("sub_id1")).click();
		driver.findElement(By.id("sub_id2")).click();
		Thread.sleep(2000);
	}

	@After
	public void tearDown() throws Exception {
		driver.quit();
		String verificationErrorString = verificationErrors.toString();
		if (!"".equals(verificationErrorString)) {
			fail(verificationErrorString);
		}
	}

	private String closeAlertAndGetItsText() {
		try {
			Alert alert = driver.switchTo().alert();
			String alertText = alert.getText();
			if (acceptNextAlert) {
				alert.accept();
			} else {
				alert.dismiss();
			}
			return alertText;
		} finally {
			acceptNextAlert = true;
		}
	}
}
