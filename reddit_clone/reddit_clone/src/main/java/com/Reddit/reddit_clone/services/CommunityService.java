package com.Reddit.reddit_clone.services;

import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityReqDto;
import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityResDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public interface CommunityService {
    CommunityResDto createCommunity(CommunityReqDto dto);
    String joinCommunity(String userEmail,String communityName);
    String deleteCommunity(String userEmail, String communityName);
    CommunityResDto getCommunityDetails(String communityName);
    List<CommunityResDto>getAllCommunities();
}
