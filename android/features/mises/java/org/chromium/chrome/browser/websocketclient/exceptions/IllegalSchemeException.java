package org.chromium.chrome.browser.websocketclient.exceptions;

/**
 * Exception which indicates that the received schema is invalid
 * 
 * @author Gustavo Avila
 *
 */
public class IllegalSchemeException extends IllegalArgumentException {
	public IllegalSchemeException(String message) {
		super(message);
	}
}
