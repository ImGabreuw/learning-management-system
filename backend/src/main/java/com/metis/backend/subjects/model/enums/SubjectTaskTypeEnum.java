package com.metis.backend.subjects.model.enums;

public enum SubjectTaskTypeEnum {
  TASK("Atividade"), PROJECT("Projeto");

  private final String translation;

  SubjectTaskTypeEnum(String translation){
      this.translation = translation;
  }

  public String getTranslation(){
      return this.translation;
  }
}
