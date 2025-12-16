package com.Reddit.reddit_clone.controllers;

import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityReqDto;
import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityResDto;
import com.Reddit.reddit_clone.services.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommunityController {
    @Autowired
    private CommunityService communityService;
    @PostMapping("/create-community")
    public ResponseEntity<CommunityResDto>createCommunity(@RequestBody CommunityReqDto dto){
        return ResponseEntity.ok(communityService.createCommunity(dto));
    }
    @PostMapping("/join-community")
    public ResponseEntity<String>joinCommunity(@RequestParam String userEmail,@RequestParam String communityName){
        return ResponseEntity.ok(communityService.joinCommunity(userEmail,communityName));
    }
    @GetMapping("/community-details")
    public ResponseEntity<CommunityResDto>getCommunityDetails(@RequestParam String communityName){
        return ResponseEntity.ok(communityService.getCommunityDetails(communityName));
    }
    @GetMapping("/get-communities")
    public ResponseEntity<List<CommunityResDto>>getCommunities(){
        return ResponseEntity.ok(communityService.getAllCommunities());
    }
    @PostMapping("/delete-community")
    public String deleteCommunity(String userEmail , String communityName){
        return communityService.deleteCommunity(userEmail,communityName);
    }

}
