package com.wipro.hostel.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.sql.SQLException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, HttpServletRequest request) {

        String message = "Database constraint violation";
        String rootMsg = ex.getMostSpecificCause() != null
                ? ex.getMostSpecificCause().getMessage()
                : ex.getMessage();

        if (rootMsg != null) {
            if (rootMsg.contains("Duplicate entry")) {
                message = "A record with this information already exists (duplicate key).";
            } else if (rootMsg.contains("foreign key") || rootMsg.contains("FOREIGN KEY")) {
                message = "Cannot complete operation: Associated record does not exist or has active dependencies.";
            }
        }

        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Conflict",
                message,
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({JpaSystemException.class, DataAccessException.class})
    public ResponseEntity<ErrorResponse> handleDatabaseException(
            Exception ex, HttpServletRequest request) {

        Throwable root = ex;
        SQLException sqlException = null;

        while (root != null) {
            if (root instanceof SQLException sqle) {
                sqlException = sqle;
                break;
            }
            root = root.getCause();
        }

        if (sqlException != null && "45000".equals(sqlException.getSQLState())) {
            String customMessage = sqlException.getMessage();
            HttpStatus status = HttpStatus.BAD_REQUEST;

            if (customMessage != null) {
                if (customMessage.contains("already allocated") || customMessage.contains("already full")) {
                    status = HttpStatus.BAD_REQUEST;
                } else if (customMessage.contains("not exist") || customMessage.contains("not found")) {
                    status = HttpStatus.NOT_FOUND;
                }
            }

            ErrorResponse error = new ErrorResponse(
                    status.value(),
                    status.getReasonPhrase(),
                    customMessage != null ? customMessage : "Database operation failed",
                    request.getRequestURI()
            );
            return new ResponseEntity<>(error, status);
        }

        String fallbackMsg = ex.getMessage();
        if (fallbackMsg != null && fallbackMsg.contains("JDBC exception executing SQL")) {
            // Clean up Hibernate wrapper text if present
            int start = fallbackMsg.indexOf('[');
            int end = fallbackMsg.indexOf(']');
            if (start != -1 && end > start) {
                fallbackMsg = fallbackMsg.substring(start + 1, end).trim();
            }
        }

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Database Error",
                fallbackMsg != null ? fallbackMsg : "Failed to execute database operation",
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequest(
            Exception ex, HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred",
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
