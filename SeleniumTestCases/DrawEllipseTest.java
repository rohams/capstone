package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

public class DrawEllipseTest {
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
	public void testDrawEllipse() throws Exception {
		driver.get(baseUrl);
		JavascriptExecutor jsx = (JavascriptExecutor) driver;
		jsx.executeScript("document.getElementById('upload-wrap').style.display = 'block';");
		WebElement fileInput = driver.findElement(By
				.xpath("//input[@type='file']"));
		fileInput.sendKeys(filePath);
		assertEquals("128 stores imported!", closeAlertAndGetItsText());
	    driver.findElement(By.id("sub_id6")).click();
	    driver.findElement(By.id("control1")).click();
	    driver.findElement(By.id("cost")).clear();
	    driver.findElement(By.id("cost")).sendKeys("10000");
	    driver.findElement(By.id("coststep")).clear();
	    driver.findElement(By.id("coststep")).sendKeys("1000");
	    driver.findElement(By.id("draw")).click();
	    assertEquals("$4000", driver.findElement(By.xpath("//div[@id='map-canvas']/div/div/div/div[3]/div[3]/div[8]/div[2]/div")).getText());
	    driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')])[7]")).click();
	    assertEquals("$5000", driver.findElement(By.xpath("//div[@id='map-canvas']/div/div/div/div[3]/div[3]/div[7]/div[2]/div")).getText());
	    driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')])[6]")).click();
	    assertEquals("$6000", driver.findElement(By.xpath("//div[@id='map-canvas']/div/div/div/div[3]/div[3]/div[6]/div[2]/div")).getText());
	    driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')])[5]")).click();
	    assertEquals("$7000", driver.findElement(By.xpath("//div[@id='map-canvas']/div/div/div/div[3]/div[3]/div[5]/div[2]/div")).getText());
	    driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')])[4]")).click();
	    assertEquals("$8000", driver.findElement(By.xpath("//div[@id='map-canvas']/div/div/div/div[3]/div[3]/div[4]/div[2]/div")).getText());
	    driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')])[3]")).click();
	    assertEquals("$9000", driver.findElement(By.xpath("//div[@id='map-canvas']/div/div/div/div[3]/div[3]/div[3]/div[2]/div")).getText());
	    driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')])[2]")).click();
	    assertEquals("$10000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("Minimum Distance: 3000 granularity: 0.020283599999999995", driver.findElement(By.id("panel")).getText());
		//jsx.executeScript("testGetEllipse(stores, map);");	
		Thread.sleep(3000);
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
