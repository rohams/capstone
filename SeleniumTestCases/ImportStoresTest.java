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
		filePath = "/Users/sj/capstone/Nodes.csv";
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
		assertEquals("128 stores imported!", closeAlertAndGetItsText());
		driver.findElement(By.id("sub_id0")).click();
	    assertEquals("Weighted Average Geolocation: (53.561727053913046,-112.38751207391304)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id1")).click();
	    assertEquals("Weighted Average Geolocation: (52.51978494709676,-113.09823476451618)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id2")).click();
	    assertEquals("Weighted Average Geolocation: (50.441917671084354,-118.52197121084338)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id3")).click();
	    assertEquals("Weighted Average Geolocation: (50.408767877029725,-118.5826320079208)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id4")).click();
	    assertEquals("Weighted Average Geolocation: (50.360966981415096,-118.8230843764151)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id5")).click();
	    assertEquals("Weighted Average Geolocation: (50.32594036724771,-118.89753822201834)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id6")).click();
	    assertEquals("Weighted Average Geolocation: (50.83700000023999,-119.40429332960001)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("sub_id7")).click();
	    assertEquals("Weighted Average Geolocation: (50.84034071210937,-119.2618901875)", driver.findElement(By.id("panel")).getText());
	    driver.findElement(By.id("heading10")).click();
		Thread.sleep(4000);
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
