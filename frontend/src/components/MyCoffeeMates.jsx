import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function MyCoffeeMates({
  confirmedFriends,
  coffeeMateQuery,
  setCoffeeMateQuery,
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
          <Typography>My Coffee Mates</Typography>
        </AccordionSummary>
        <input
          type="text"
          placeholder="search fellow coffee snobs"
          value={coffeeMateQuery}
          onChange={(e) => setCoffeeMateQuery(e.target.value)}
        />
        <AccordionDetails style={{ display: "flex" }}>
          {confirmedFriends.length > 0 ? (
            confirmedFriends.map((friend, index) => (
              <a href={`/profile/${friend}`} key={index}>
                ~ {friend}
              </a>
            ))
          ) : (
            <p>You Have No Friends 😢</p>
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
