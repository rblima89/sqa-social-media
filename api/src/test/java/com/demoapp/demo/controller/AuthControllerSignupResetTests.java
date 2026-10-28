package com.demoapp.demo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

@WebMvcTest(AuthController.class)
public class AuthControllerSignupResetTests {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private UserService userService;

  @Test
  @DisplayName("BUG: signup com e-mail já existente deve retornar 409 e 'E-mail já cadastrado'")
  void deveRetornarMensagemCorretaQuandoEmailJaCadastrado() throws Exception {
    when(userService.isEmailValid("aluno@teste.com")).thenReturn(true);
    when(userService.isPasswordValid("Password123!")).thenReturn(true);
    when(userService.findByEmail("aluno@teste.com")).thenReturn(new User());

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"aluno@teste.com\",\"password\":\"Password123!\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
  }

  @Test
  @DisplayName("reset-password com e-mail não cadastrado retorna 404 e 'Usuário não encontrado'")
  void deveRetornar404QuandoUsuarioNaoExiste() throws Exception {
    when(userService.isEmailValid("nao@existe.com")).thenReturn(true);
    when(userService.findByEmail("nao@existe.com")).thenReturn(null);

    mockMvc.perform(post("/auth/reset-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"nao@existe.com\"}"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Usuário não encontrado"));
  }
}
