package com.metis.backend.subjects.model.enum;

public enum SubjectTaskTypeEnum {
  CONCLUIDA("Concluída"),EM_ANDAMENTO("Em Andamento");

  private String typeAsStr;

  public SubjectTaskTypeEnum(String typeAsStr){
      this.typeAsStr = typeAsStr;
  }

  public String getTypeAsStr(){
      return this.typeAsStr;
  }

}
