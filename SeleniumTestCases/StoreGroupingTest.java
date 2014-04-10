package com.selenium.main;

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class StoreGroupingTest {
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
	    driver.findElement(By.id("sub_id1")).click();
	    driver.findElement(By.id("control4")).click();
	    driver.findElement(By.id("dc-lat")).clear();
	    driver.findElement(By.id("dc-lat")).sendKeys("49.1");
	    driver.findElement(By.id("dc-lng")).clear();
	    driver.findElement(By.id("dc-lng")).sendKeys("-120");
	    driver.findElement(By.id("insert-dc")).click();
	    new Select(driver.findElement(By.id("opts"))).selectByVisibleText("Store Grouping");
	    driver.findElement(By.xpath("//img[contains(@src,'https://maps.gstatic.com/mapfiles/api-3/images/mapcnt3.png')]")).click();
	    driver.findElement(By.id("off-lim")).clear();
	    driver.findElement(By.id("off-lim")).sendKeys("4");
	    driver.findElement(By.id("off-rate")).clear();
	    driver.findElement(By.id("off-rate")).sendKeys("4");
	    driver.findElement(By.id("no-trks")).clear();
	    driver.findElement(By.id("no-trks")).sendKeys("3");
	    driver.findElement(By.id("pop-size")).clear();
	    driver.findElement(By.id("pop-size")).sendKeys("60");
	    driver.findElement(By.cssSelector("#panel12 > button.panel-button")).click();
	    assertEquals("Total cost: 1094.49 Total distance: 1013.46", driver.findElement(By.id("panel")).getText());
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
