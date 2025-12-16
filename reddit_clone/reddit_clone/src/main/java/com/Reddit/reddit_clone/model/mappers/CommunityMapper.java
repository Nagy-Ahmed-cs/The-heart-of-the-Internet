package com.Reddit.reddit_clone.model.mappers;

import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityReqDto;
import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityResDto;
import com.Reddit.reddit_clone.model.entities.Community;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommunityMapper {
    Community toEntity(CommunityReqDto dto);
    List<CommunityResDto>toResponses(List<Community>communities);
    @Mapping(source = "createdBy.userName",target="createdByName")
    @Mapping(source = "createdBy.email", target="createdByEmail")
    CommunityResDto toResponse(Community community);

}
