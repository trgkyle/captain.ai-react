import React, { FormEvent, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getDogsAPI } from "../apis/getDogs";
import { DogType } from "../interfaces";

const Container = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Header = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HorizontalBarContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HorizontalBar = styled(Divider)(({ theme }) => ({
  width: "100%",
}));

const Body = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ImageCard = styled(Card)(({ theme }) => ({
  width: 300,
  height: 300,
  margin: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "lightgray",
  transition: "background-color 0.3s ease",
  position: "relative",
  "&.selected:after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#41BCFF",
    opacity: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const CheckIconContainer = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 2,
});

const Layout: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<DogType[]>([]);
  const [selectedCards, setSelectedCards] = useState<DogType[]>([]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(event.target.value);
    setAmount(newAmount);
  };

  const handleLoadImages = async () => {
    setIsLoading(true);
    const dogsList: any[] = await getDogsAPI(amount);

    const currentCards = [...cards];
    const currentSelectedCards = [...selectedCards];

    // loop check selected card to replace element select from dogsList
    for (let i = 0; i < selectedCards.length; i++) {
      // found index number of selected card in cards list
      const cardSelectedFoundInCardsIndex = cards.indexOf(selectedCards[i]);

      // make sure dogsList not empty to replace element and selected element found in cards list
      if (dogsList.length > 0 && cardSelectedFoundInCardsIndex !== -1) {
        // replace selected element to new element from dogsList
        currentCards[cardSelectedFoundInCardsIndex] = dogsList[0];
        dogsList.shift();

        // remove selected element
        const selectedCardIndex = currentSelectedCards.indexOf(
          selectedCards[i]
        );
        currentSelectedCards.slice(selectedCardIndex, 1);
      }
    }

    setCards([...currentCards.concat(dogsList)]);
    setSelectedCards(currentSelectedCards);
    setIsLoading(false);
  };

  const handleClearImages = () => {
    setCards(cards.filter((card) => selectedCards.includes(card)));
    setSelectedCards([]);
  };

  const handleCardClick = (card: DogType) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(
        selectedCards.filter((selectedCard) => selectedCard !== card)
      );
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleLoadImages();
  };

  return (
    <Container container>
      <form onSubmit={handleOnSubmit}>
        <Header container alignItems="center">
          <Grid item sx={{ ml: 1 }}>
            <TextField
              type="number"
              label="Amount"
              variant="outlined"
              value={amount}
              onChange={handleAmountChange}
              size="small"
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item sx={{ ml: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              LOAD 🐶
            </Button>
          </Grid>
          <Grid item sx={{ ml: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearImages}
            >
              CLEAR
            </Button>
          </Grid>

          {isLoading ? (
            <Grid item sx={{ ml: 2 }}>
              <CircularProgress size={35} />
            </Grid>
          ) : null}
        </Header>
      </form>
      <HorizontalBarContainer container>
        <HorizontalBar sx={{ ml: 1 }} />
      </HorizontalBarContainer>

      <Body container>
        {cards.map((card, index) => (
          <Grid item key={index}>
            <ImageCard
              onClick={() => handleCardClick(card)}
              className={selectedCards.includes(card) ? "selected" : ""}
            >
              <CardContent>
                <StyledImage src={card.url} alt="dog" />
                {selectedCards.includes(card) && (
                  <CheckIconContainer>
                    {!isLoading ? (
                      <CheckCircleIcon
                        style={{ color: "#1565C0", fontSize: 64 }}
                      />
                    ) : (
                      <CircularProgress
                        style={{ color: "#1565C0", fontSize: 64 }}
                      />
                    )}
                  </CheckIconContainer>
                )}
              </CardContent>
            </ImageCard>
          </Grid>
        ))}
      </Body>
    </Container>
  );
};

export default Layout;
