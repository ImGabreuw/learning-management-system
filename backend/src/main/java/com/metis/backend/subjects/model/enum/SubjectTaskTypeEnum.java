package com.metis.backend.subjects.model.enum;

public enum SubjectTaskTypeEnum {
  TASK("Atividade"), PROJECT("Projeto");

  private String translation;

  public SubjectTaskTypeEnum(String translation){
      this.translation = translation;
  }

  public String getTranslation(){
      return this.translation;
  }
}
