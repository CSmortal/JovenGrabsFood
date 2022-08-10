import { Box, Divider, FormLabel, List, ListItem, ListItemText, Paper, Radio, RadioGroup, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { orderFoodItemActions } from '../../store/orderFoodItemSlice'
import { Fragment } from "react"

export default function OrderItemSection({ section }) {
  // section object
  // {sectionName: __, options: [{description: __, priceChange: ___}] }
  let counter = 1
  const { sectionName, options } = section
  const dispatch = useDispatch()

  const selectedOption = useSelector(state => {
    return state.orderFoodItem.sectionDetails
      .filter(sectionObj => sectionObj.sectionName === sectionName)[0]
      .options
      .filter(optionObj => optionObj.isSelected === true)[0]
  }
)


  return (
    <Box sx={{mt: 4, width: 0.9 , mx: "auto"}}>
      <Paper elevation={2}>
        <FormLabel id={`section-label-for-${sectionName}`}>{sectionName}</FormLabel>

        <List>
          <RadioGroup
            aria-labelledby={`section-label-for-${sectionName}`}
            name={`radio-group-for-${sectionName}`}
            onChange={e => dispatch(orderFoodItemActions.setOptionChecked({ sectionName, optionDescription: e.target.value }))}
            value={selectedOption ? selectedOption.description : ""}
          >
            {options.map(option => {
              const priceChange = parseFloat(option.priceChange).toFixed(2)
              return (
                <>
                  <ListItem
                    // divider
                    key={counter++}
                    secondaryAction={
                      <Typography>{
                        priceChange > 0 
                          ? `+${priceChange}`
                          : priceChange == 0
                            ? "-"
                            : `-${priceChange}`
                      }</Typography>
                    }
                  >

                    <Radio 
                      value={option.description}
                    />

                    <ListItemText primary={option.description}/>

                  </ListItem>
                  <Divider variant="middle" />
                </>

              )
            })}

          </RadioGroup>
        </List>
      </Paper>

    </Box>


    
  )
}