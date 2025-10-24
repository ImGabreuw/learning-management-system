package com.metis.backend.subjects.model.enums;

public enum SubjectTaskTypeEnum {
  PENDING("Pendente"), DONE("Concluída");

  private final String translation;

  SubjectTaskTypeEnum(String translation){
      this.translation = translation;
  }

  public String getTranslation(){
      return this.translation;
  }

}
