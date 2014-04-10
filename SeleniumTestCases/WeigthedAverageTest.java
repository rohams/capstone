package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;

public class WeigthedAverageTest {
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
	public void testWeightedAverageFromAddedStores() throws Exception {
		driver.get(baseUrl);
		driver.findElement(By.id("control3")).click();
		driver.findElement(By.id("lat")).clear();
		driver.findElement(By.id("lat")).sendKeys("51");
		driver.findElement(By.id("lng")).clear();
		driver.findElement(By.id("lng")).sendKeys("-120");
		driver.findElement(By.id("weight")).clear();
		driver.findElement(By.id("weight")).sendKeys("1");
		driver.findElement(By.id("add")).click();
		driver.findElement(By.id("lat")).clear();
		driver.findElement(By.id("lat")).sendKeys("60");
		driver.findElement(By.id("lng")).clear();
		driver.findElement(By.id("lng")).sendKeys("-132");
		driver.findElement(By.id("weight")).clear();
		driver.findElement(By.id("weight")).sendKeys("2");
		//driver.findElement(By.id("add")).click();
		//driver.findElement(By.id("control4")).click();
		driver.findElement(By.id("control2")).click();
		//driver.findElement(By.id("ave")).click();
		assertEquals("Weighted Average Geolocation: (51,-120)", driver.findElement(By.id("panel")).getText());
		Thread.sleep(3000);
	}

	@Test
	public void testWeightedAverageFromImportAndAdd() throws Exception {
		driver.get(baseUrl);
		JavascriptExecutor jsx = (JavascriptExecutor) driver;
		jsx.executeScript("document.getElementById('upload-wrap').style.display = 'block';");
		WebElement fileInput = driver.findElement(By
				.xpath("//input[@type='file']"));
		fileInput.sendKeys(filePath);
		assertEquals("128 stores imported!", closeAlertAndGetItsText());
		driver.findElement(By.id("control3")).click();
		driver.findElement(By.id("lat")).clear();
		driver.findElement(By.id("lat")).sendKeys("49");
		driver.findElement(By.id("lng")).clear();
		driver.findElement(By.id("lng")).sendKeys("-120");
		driver.findElement(By.id("weight")).clear();
		driver.findElement(By.id("weight")).sendKeys("20");
		driver.findElement(By.id("add")).click();
		driver.findElement(By.id("sub_id0")).click();
		driver.findElement(By.id("sub_id1")).click();
		driver.findElement(By.id("sub_id2")).click();
		driver.findElement(By.id("sub_id3")).click();
		driver.findElement(By.id("sub_id4")).click();
		driver.findElement(By.id("sub_id5")).click();
		driver.findElement(By.id("control2")).click();
		//driver.findElement(By.id("ave")).click();
		assertEquals("Weighted Average Geolocation: (50.120368217286824,-119.06846252868218)", driver.findElement(By.id("panel")).getText());
		Thread.sleep(3000);
	}

	@Test
	public void testWeightedAverageFromImportedStores() throws Exception {
		driver.get(baseUrl);
		JavascriptExecutor jsx = (JavascriptExecutor) driver;
		jsx.executeScript("document.getElementById('upload-wrap').style.display = 'block';");
		WebElement fileInput = driver.findElement(By
				.xpath("//input[@type='file']"));
		fileInput.sendKeys(filePath);
		assertEquals("128 stores imported!", closeAlertAndGetItsText());
		driver.findElement(By.id("sub_id0")).click();
		driver.findElement(By.id("sub_id1")).click();
		driver.findElement(By.id("sub_id2")).click();
		driver.findElement(By.id("control2")).click();
		//driver.findElement(By.id("ave")).click();
		assertEquals(
				"Weighted Average Geolocation: (50.441917671084354,-118.52197121084338)",
				driver.findElement(By.id("panel")).getText());
		Thread.sleep(3000);
	}

	@Test
	public void testWeightedAverageAfterRemovingAStore() throws Exception {
		Actions action = new Actions(driver);
		driver.get(baseUrl);
		JavascriptExecutor jsx = (JavascriptExecutor) driver;
		jsx.executeScript("document.getElementById('upload-wrap').style.display = 'block';");
		WebElement fileInput = driver.findElement(By
				.xpath("//input[@type='file']"));
		fileInput.sendKeys(filePath);
		assertEquals("128 stores imported!", closeAlertAndGetItsText());
		driver.findElement(By.id("sub_id0")).click();
		driver.findElement(By.id("sub_id1")).click();
		driver.findElement(By.id("sub_id2")).click();
		driver.findElement(By.id("sub_id3")).click();
		driver.findElement(By.id("sub_id4")).click();
		driver.findElement(By.id("sub_id5")).click();
		driver.findElement(By.id("control3")).click();
		driver.findElement(By.id("lat")).clear();
		driver.findElement(By.id("lat")).sendKeys("49");
		driver.findElement(By.id("lng")).clear();
		driver.findElement(By.id("lng")).sendKeys("-120");
		driver.findElement(By.id("weight")).clear();
		driver.findElement(By.id("weight")).sendKeys("20");
		driver.findElement(By.id("add")).click();
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[25]")));
		action.perform();
		driver.findElement(By.id("control2")).click();
		assertEquals(
				"Weighted Average Geolocation: (50.123639323125005,-119.13018011796875)",
				driver.findElement(By.id("panel")).getText());
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
