package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

public class AddStoreTest {
	private WebDriver driver;
	private String baseUrl;
	private StringBuffer verificationErrors = new StringBuffer();

	@Before
	public void setUp() throws Exception {
		driver = new FirefoxDriver();
		baseUrl = "file:///Users/sj/capstone/index.html";
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	}

	@Test
	public void testAddStore() throws Exception {
		driver.get(baseUrl);
		driver.findElement(By.id("control3")).click();
	    driver.findElement(By.id("lat")).clear();
	    driver.findElement(By.id("lat")).sendKeys("49");
	    driver.findElement(By.id("lng")).clear();
	    driver.findElement(By.id("lng")).sendKeys("-120");
	    driver.findElement(By.id("weight")).clear();
	    driver.findElement(By.id("weight")).sendKeys("1");
	    driver.findElement(By.id("add")).click();
	    driver.findElement(By.cssSelector("img")).click();
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("Store ID: manually-added-1\nSub-network: undefined\nStore Demand: undefined\nNormalized Weight: 1\nLatitude: 49\nLongitude: -120", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
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
}
