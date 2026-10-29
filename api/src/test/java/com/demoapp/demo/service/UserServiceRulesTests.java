package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

// Testes unitários simples: só JUnit, sem Spring, sem MockMvc, sem Mockito
public class UserServiceRulesTests {

  private final UserService userService = new UserService(null);

  @Test
  @DisplayName("Rejeita senha com menos de 8 caracteres")
  void deveRejeitarSenhaCurta() {
    assertFalse(userService.isPasswordValid("Ab1@xyz")); // 7 caracteres
  }

  @Test
  @DisplayName("BUG: '#' é caractere especial e deveria ser aceito (regex só aceita @$!%*?&)")
  void deveAceitarHashComoCaractereEspecial() {
    assertTrue(userService.isPasswordValid("Abcdef1#"));
  }
}
