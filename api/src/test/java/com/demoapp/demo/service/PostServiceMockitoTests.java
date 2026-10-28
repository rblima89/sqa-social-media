package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

@ExtendWith(MockitoExtension.class)
public class PostServiceMockitoTests {

  @Mock
  private UserPostReactionRepository reactionRepository;

  @InjectMocks
  private PostService postService;

  @Test
  @DisplayName("toggleLike: quando não existe reação, salva e retorna liked=true")
  void deveCurtirQuandoNaoExisteReacao() {
    when(reactionRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.empty());

    Map<String, Object> result = postService.toggleLike(10L, 1L);

    assertEquals(true, result.get("liked"));
    verify(reactionRepository).save(any(UserPostReaction.class));
  }

  @Test
  @DisplayName("toggleLike: quando já existe reação, remove e retorna liked=false")
  void deveDescurtirQuandoJaExisteReacao() {
    UserPostReaction existente = new UserPostReaction();
    when(reactionRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.of(existente));

    Map<String, Object> result = postService.toggleLike(10L, 1L);

    assertEquals(false, result.get("liked"));
    verify(reactionRepository).delete(existente);
    verify(reactionRepository, never()).save(any());
  }
}
