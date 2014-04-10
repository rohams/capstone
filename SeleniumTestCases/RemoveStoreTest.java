package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;

public class RemoveStoreTest {
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
	public void testRemoveStoresAfterAddAndImport() throws Exception {
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
		driver.findElement(By.id("sub_id6")).click();
		driver.findElement(By.id("sub_id7")).click();
		Actions action = new Actions(driver);
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[25]")));
		action.perform();
		assertEquals("Removed a store at (49.70166667, -111.1686111)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[127]")));
		action.perform();
		assertEquals("Removed a store at (50.88805556, -112.0363889)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[27]")));
		action.perform();
		assertEquals("Removed a store at (49.72805556, -113.1075)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[25]")));
		action.perform();
		assertEquals("Removed a store at (49.49694444, -116.7075)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[112]")));
		action.perform();
		assertEquals("Removed a store at (52.12888889, -121.8658333)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[108]")));
		action.perform();
		assertEquals("Removed a store at (54.04888889, -127.3383333)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[27]")));
		action.perform();
		assertEquals("Removed a store at (49.46027778, -119.4925)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[107]")));
		action.perform();
		assertEquals("Removed a store at (53.91916667, -121.2177778)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[109]")));
		action.perform();
		assertEquals("Removed a store at (54.23416667, -124.2502778)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[107]")));
		action.perform();
		assertEquals("Removed a store at (52.98138889, -121.4738889)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[112]")));
		action.perform();
		assertEquals("Removed a store at (51.73583333, -120.6533333)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[94]")));
		action.perform();
		assertEquals("Removed a store at (50.69277778, -118.7002778)", driver.findElement(By.id("panel")).getText());
		
		action.doubleClick(driver.findElement(By.xpath("(//img[contains(@src,'https://maps.gstatic.com/mapfiles/transparent.png')])[108]")));
		action.perform();
		assertEquals("Removed a store at (53.86833333, -121.225)", driver.findElement(By.id("panel")).getText());
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
