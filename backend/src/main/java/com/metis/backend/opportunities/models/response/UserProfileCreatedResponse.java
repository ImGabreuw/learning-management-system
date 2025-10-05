package com.metis.backend.opportunities.models.response;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileCreatedResponse {

    private String id;

    private List<String> skillsId;

    private List<String> interestsId;

}
