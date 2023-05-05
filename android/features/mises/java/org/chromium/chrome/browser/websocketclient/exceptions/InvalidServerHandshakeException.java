package org.chromium.chrome.browser.websocketclient.exceptions;

/**
 * Exception which indicates that the handshake received from the server is
 * invalid
 * 
 * @author Gustavo Avila
 *
 */
public class InvalidServerHandshakeException extends RuntimeException {
	public InvalidServerHandshakeException(String message) {
		super(message);
	}
}
