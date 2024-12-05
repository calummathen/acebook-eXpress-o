import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import ApproveFriendRequestButton from "./ApproveFriendRequestButton";
import DenyFriendRequestButton from "./DenyFriendRequestButton";
import UserInfoTable from "./UserInfo";

export default function MyCoffeeMates({
    unapprovedFriendRequests,
    unfilteredFriends,
    filteredConfirmedFriends,
    coffeeMateQuery,
    setCoffeeMateQuery,
    setUpdatePost,
    upcomingBirthdays
}) {
    return (
        <div className="my-profile-coffee-mates">
            <Accordion className="accordion-main-profile">
                <AccordionSummary
                    className="accordion-summary-profile"
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="friend-requests-content"
                    id="pending-requests">
        
                    <Typography>Pending Coffee Mates</Typography>
                </AccordionSummary>
        
                <AccordionDetails className="accordion-details-profile">
            
                    {unapprovedFriendRequests.length > 0 ? (
                        unapprovedFriendRequests.map((request) => (
                
                            <div key={request._id} className="profile-friend-request"> 
                                <a href={`/profile/${request.sender}`}>~ {request.sender}</a>

                                <div>
                                    <ApproveFriendRequestButton 
                                        friendRequestId={request._id}
                                        setUpdatePost={setUpdatePost}
                                    />
                                    <DenyFriendRequestButton 
                                        friendRequestId={request._id}
                                        setUpdatePost={setUpdatePost}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="profile-no-requests">You Have No Requests</p>
                    )}
                </AccordionDetails>
            </Accordion>
        
            <Accordion className="accordion-main-profile">
                <AccordionSummary
                    className="accordion-summary-profile"
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="friends-content"
                    id="friends">
                    
                    <Typography>My Coffee Mates</Typography>
                </AccordionSummary>
        
                <AccordionDetails className="accordion-details-profile">
        
                    {unfilteredFriends.length > 0 && (
                        <>
                            <input
                                className="search-coffee-mates"
                                type="text"
                                placeholder="filter fellow coffee snobs"
                                value={coffeeMateQuery}
                                onChange={(e) => setCoffeeMateQuery(e.target.value)}
                            />

                            {filteredConfirmedFriends.length > 0 &&
                            filteredConfirmedFriends.map((friend, index) => (
                    
                                <a href={`/profile/${friend}`} key={index} className="search-coffee-mates-result">
                                    {friend}
                                </a>
                            ))}
                        </>
                    )}
                </AccordionDetails>
            </Accordion>
            
            <Accordion className="accordion-main-profile">
                <AccordionSummary
                    className="accordion-summary-profile"
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="birthdays-content"
                    id="birthdays">

                    <Typography>Upcoming Birthdays</Typography>
                </AccordionSummary>
            
                <AccordionDetails className="accordion-details-profile">
                
                    {upcomingBirthdays.length > 0 ? (
                        upcomingBirthdays.map(birthday => (
                        
                            <a className="profile-birthdays" key={birthday.username} href={`/profile/${birthday.username}`}>{birthday.username}: {birthday.birthday.toDateString()}</a>

                        ))
                    ) : (
                        <p className="profile-no-birthdays">No Upcoming Birthdays</p>
                    )}
                
                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary
                    className="accordion-summary-profile"
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="about-me-content"
                    id="about-me">

                    <Typography>About Me</Typography>
                </AccordionSummary>
        
                <AccordionDetails className="accordion-details-profile">

                    <UserInfoTable />
            
                </AccordionDetails>
            </Accordion>
        </div>
    );
}