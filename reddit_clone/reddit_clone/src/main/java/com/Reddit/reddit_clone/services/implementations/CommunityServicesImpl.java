package com.Reddit.reddit_clone.services.implementations;

import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityReqDto;
import com.Reddit.reddit_clone.model.dtos.CommunityDtos.CommunityResDto;
import com.Reddit.reddit_clone.model.entities.Community;
import com.Reddit.reddit_clone.model.entities.User;
import com.Reddit.reddit_clone.model.mappers.CommunityMapper;
import com.Reddit.reddit_clone.repos.CommunityRepo;
import com.Reddit.reddit_clone.repos.UserRepo;
import com.Reddit.reddit_clone.services.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
public class CommunityServicesImpl implements CommunityService {
    @Autowired

    private CommunityRepo communityRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CommunityMapper communityMapper;
    @Override
    public CommunityResDto createCommunity(CommunityReqDto dto) {
        Optional<User>user=userRepo.findById(dto.getUserId());
        if(user.isPresent()){
            Community community=communityMapper.toEntity(dto);
            community.setCreatedBy(user.get());
            user.get().getCommunities().add(community);
            userRepo.save(user.get());
            return communityMapper.toResponse(communityRepo.save(community));
        }
        return null;
    }

    @Override
    public String joinCommunity(String userEmail, String communityName) {
        Optional<User>user=userRepo.findByEmail(userEmail);
        Optional<Community>community=communityRepo.findByCommunityName(communityName);
        if(user.isPresent()&&community.isPresent()){
            if(user.get().getJoinedCommunities().contains(community.get())){
                return "The user is already in the community ...\n";
            }
            user.get().getJoinedCommunities().add(community.get());
            community.get().getMembers().add(user.get());
            communityRepo.save(community.get());
            userRepo.save(user.get());

            return "Completely joined the community ......\n";
        }
        return "User is not here or the community is not provided........\n ";
    }

    @Override
    public String deleteCommunity(String userEmail, String communityName) {
        Optional<User>user=userRepo.findByEmail(userEmail);
        Optional<Community>community=communityRepo.findByCommunityName(communityName);
        if(user.isPresent()&&community.isPresent()) {
            if(community.get().getCreatedBy().getEmail().equals(userEmail)) {
                community.get().setDeleteAt(LocalDateTime.now());
                communityRepo.save(community.get());
                return "The community deleted successfully ....\n";
            }
        }

        return "The community is not here or you Entered the wrong Email address....\n";
    }

    @Override
    public CommunityResDto getCommunityDetails(String communityName) {
        Optional<Community>community=communityRepo.findByCommunityName(communityName);
        if(community.isPresent()){
            return communityMapper.toResponse(community.get());
        }
        else {
            System.out.println("The Community si not here ....\n");
            return null;
        }
    }

    @Override
    public List<CommunityResDto> getAllCommunities() {
        return communityMapper.toResponses(communityRepo.findAll());
    }
}
