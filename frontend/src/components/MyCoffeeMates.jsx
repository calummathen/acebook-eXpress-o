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
    <div>
      <Accordion
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Pending Requests</Typography>
        </AccordionSummary>
        <AccordionDetails
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
          }}
        >
          {unapprovedFriendRequests.length > 0 ? (
            unapprovedFriendRequests.map((request) => (
              <div key={request._id}> 
                <a href={`/profile/${request.sender}`}>
                  ~ {request.sender}
                </a>
                <ApproveFriendRequestButton 
                  friendRequestId={request._id}
                  setUpdatePost={setUpdatePost}
                />
                <DenyFriendRequestButton 
                  friendRequestId={request._id}
                  setUpdatePost={setUpdatePost}
                />
              </div>
            ))
          ) : (
            <p>You Have No Requests</p>
          )}

        </AccordionDetails>
      </Accordion>

      <Accordion
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>My Coffee Mates</Typography>
        </AccordionSummary>
        {unfilteredFriends.length > 1 && (
          <input
            type="text"
            placeholder="filter fellow coffee snobs"
            value={coffeeMateQuery}
            onChange={(e) => setCoffeeMateQuery(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "80%",
              maxWidth: "400px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              justifySelf: "start",
            }}
          />
        )}
        <AccordionDetails
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
          }}
        >
          {filteredConfirmedFriends.length > 0 &&
            filteredConfirmedFriends.map((friend, index) => (
              <a href={`/profile/${friend}`} key={index}>
                {friend}
              </a>
            ))}
      </AccordionDetails>
    </Accordion>

    <Accordion
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Upcoming Birthdays</Typography>
        </AccordionSummary>
        <AccordionDetails
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
          }}
        >
          {upcomingBirthdays.length > 0 ? (
            upcomingBirthdays.map((birthday, index) => (
              <div key={index}> 
                <a href={`/profile/${birthday.username}`}>{birthday.username}: {birthday.birthday.toDateString()}</a>
                <p>
                </p>
              </div>
            ))
          ) : (
            <p>No Upcoming Birthdays</p>
          )}

        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>About Me</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UserInfoTable />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
