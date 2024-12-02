import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function MyCoffeeMates({
  unfilteredFriends,
  filteredConfirmedFriends,
  coffeeMateQuery,
  setCoffeeMateQuery,
}) {
  let noFriendsMessage = null;

  if (unfilteredFriends.length === 1 && coffeeMateQuery === "") {
    noFriendsMessage = <p>You Have No Friends 😢</p>;
  }
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
          <Typography>My Coffee Mates</Typography>
        </AccordionSummary>
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
        <AccordionDetails
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
          }}
        >
          {noFriendsMessage}
          {filteredConfirmedFriends.length > 0 ? (
            filteredConfirmedFriends.map((friend, index) => (
              <a href={`/profile/${friend}`} key={index}>
                {friend}
              </a>
            ))
          ) : (
            <p>Search All You Want...You Still Have No Friends 😢!!!</p>
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
          <Typography>about me form</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
