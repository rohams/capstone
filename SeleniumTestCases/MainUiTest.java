package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

public class MainUiTest {
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
	public void testUI() throws Exception {
		driver.get(baseUrl);
		assertTrue(isElementPresent(By.id("imp_1")));
	    assertTrue(isElementPresent(By.id("control4")));
	    assertTrue(isElementPresent(By.id("control3")));
	    assertTrue(isElementPresent(By.id("control2")));
	    assertTrue(isElementPresent(By.id("control1")));
	    assertTrue(isElementPresent(By.linkText("Help")));
	    driver.findElement(By.id("control4")).click();
	    assertTrue(isElementPresent(By.id("dc-lat")));
	    assertTrue(isElementPresent(By.id("dc-lng")));
	    assertTrue(isElementPresent(By.id("insert-dc")));
	    driver.findElement(By.id("control3")).click();
	    assertTrue(isElementPresent(By.id("lat")));
	    assertTrue(isElementPresent(By.id("lng")));
	    assertTrue(isElementPresent(By.id("weight")));
	    assertTrue(isElementPresent(By.id("add")));
	    driver.findElement(By.id("control1")).click();
	    assertTrue(isElementPresent(By.id("cost")));
	    assertTrue(isElementPresent(By.id("coststep")));
	    assertTrue(isElementPresent(By.id("draw")));
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
	
	private boolean isElementPresent(By by) {
	    try {
	      driver.findElement(by);
	      return true;
	    } catch (NoSuchElementException e) {
	      return false;
	    }
	  }
}
