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
	    filePath = "/Users/sj/capstone/UBC ECE Capstone Project - Nodes.csv";
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	  }

	  @Test
	  public void testDrawEllipse() throws Exception {
	    driver.get(baseUrl);
	    JavascriptExecutor jsx = (JavascriptExecutor) driver;
		jsx.executeScript("document.getElementById('upload-wrap').style.display = 'block';");
	    WebElement fileInput = driver.findElement(By.xpath("//input[@type='file']"));
	    fileInput.sendKeys(filePath);
	    assertEquals("25 stores imported!", closeAlertAndGetItsText());
	    driver.findElement(By.id("sub_id0")).click();
	    driver.findElement(By.id("sub_id1")).click();
	    driver.findElement(By.id("sub_id2")).click();
	    driver.findElement(By.id("sub_id3")).click();
	    driver.findElement(By.id("sub_id4")).click();
	    driver.findElement(By.id("sub_id5")).click();
	    driver.findElement(By.id("control1")).click();
	    driver.findElement(By.id("cost")).clear();
	    driver.findElement(By.id("cost")).sendKeys("160000");
	    driver.findElement(By.id("coststep")).clear();
	    driver.findElement(By.id("coststep")).sendKeys("4000");
	    driver.findElement(By.id("draw")).click();
	    assertEquals("$160000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$156000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$152000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$148000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$144000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$140000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$136000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$132000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$128000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$124000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$120000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$116000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$112000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$108000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    assertEquals("$104000", driver.findElement(By.cssSelector("div.gm-style-iw > div")).getText());
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
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

