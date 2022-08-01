import { FormLabel, List, ListItem, ListItemText, Radio, RadioGroup, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { orderFoodItemActions } from '../../store/orderFoodItemSlice'

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
    <>
      <FormLabel id={`section-label-for-${sectionName}`}>{sectionName}</FormLabel>

      <List>
        <RadioGroup
          aria-labelledby={`section-label-for-${sectionName}`}
          name={`radio-group-for-${sectionName}`}
          onChange={e => dispatch(orderFoodItemActions.setOptionChecked({ sectionName, optionDescription: e.target.value }))}
          value={selectedOption ? selectedOption.description : ""}
        >
          {options.map(option => {
            return (
              <ListItem
                key={counter++}
                secondaryAction={
                  <Typography>{
                    option.priceChange > 0 
                      ? `+${option.priceChange}`
                      : option.priceChange === 0
                        ? "-"
                        : `-${option.priceChange}`
                  }</Typography>
                }
              >

                <Radio 
                  value={option.description}
                />

                <ListItemText primary={option.description}/>

              </ListItem>
            )
          })}

        </RadioGroup>
      </List>

    </>
  )
}