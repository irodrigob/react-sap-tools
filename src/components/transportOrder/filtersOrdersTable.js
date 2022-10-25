import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FilterBar,
  FilterGroupItem,
  MultiComboBox,
  MultiComboBoxItem,
  DatePicker,
  ValueState,
  Text
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/filter";
import { showToast, MESSAGE } from "utils/general/message";
import { useTranslations } from "translations/i18nContext";
import useFilterValues from "components/transportOrder/useFilterValues";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";
import { STATUS } from "utils/sap/transportOrder";
import { toolbarFiltersAction } from "reduxStore/sapTransportOrderSlice";


export default function FiltersOrdersTable(props) {
  const dispatch = useDispatch();
  const { getI18nText } = useTranslations();
  const { getDefaultFilters } = useFilterValues();
  const { toolbarFilters } = useSelector((state) => state.SAPTransportOrder);
  const { reloadUserOrders } = useSAPTransportOrder();
  const [filtersValueState,setFiltersValueState]=useState({orderTypes:ValueState.None,
                                                           orderTypesDesc:"",
                                                          orderStatus:ValueState.None,
                                                          orderStatusDesc:"",
                                                        releaseDate:ValueState.None,
                                                      releaseDateDesc:""})

  /*************************************
   * Funciones
   ************************************/
  /**
   * Evento que se dispara cuando cambian los valores de los filtros.
   * @param {object} e | Datos del evento de modificación
   */
  const onFilterChange = (e) => {
    let newFilterValues = { ...toolbarFilters };

    newFilterValues[e.target.id] = newFilterValues[e.target.id].map((row) => {
      if (e.detail.items.find((item) => item.id == row.code))
        return { ...row, selected: true };
      else return { ...row, selected: false };
    });
    dispatch(toolbarFiltersAction(newFilterValues));

    // Se actualiza el valueState del campo
    let newFiltersValueState={...filtersValueState}
    let fieldDesc=e.target.id+"Desc"
    if(newFilterValues[e.target.id].findIndex((row)=> row.selected)!=-1)
        {          
          newFiltersValueState[e.target.id]=ValueState.Error          
          newFiltersValueState[fieldDesc]=getI18nText("transportOrder.filters.validations.fieldMandatory")
          
        }
        else{
          newFiltersValueState[e.target.id]=ValueState.None
          newFiltersValueState[fieldDesc]=""
        }
        setFiltersValueState(newFiltersValueState)
  };

  return (
    <FilterBar
      hideToolbar={true}
      style={{ marginBottom: "0.4rem" }}
      showGoOnFB
      showRestoreOnFB
      hideFilterConfiguration={false}
      onGo={(e) => {
        if(filtersValueState.orderStatus==ValueState.Error || filtersValueState.orderTypes==ValueState.Error 
            || filtersValueState.releaseDate==ValueState.Error ){
              showToast(
                getI18nText("transportOrder.filters.validations.fixErrorFilters"),
                MESSAGE.TYPE.ERROR
              );
            }
            else{
              reloadUserOrders();
            }
        
      }}
      onRestore={() => {
        dispatch(toolbarFiltersAction(getDefaultFilters()));
      }}
    >
      <FilterGroupItem
        active
        label={getI18nText("transportOrder.filters.type.labelOrder")}
        required
      >
        <MultiComboBox onSelectionChange={onFilterChange} id="orderTypes" 
                       valueState={filtersValueState.orderTypes}
                       valueStateMessage={<Text>{filtersValueState.orderTypesDesc}</Text>}>
          {toolbarFilters.orderTypes.map((row) => {
            return (
              <MultiComboBoxItem
                text={row.text}
                selected={row.selected}
                key={row.code}
                id={row.code}                
              />
            );
          })}
        </MultiComboBox>
      </FilterGroupItem>
      <FilterGroupItem
        active
        label={getI18nText("transportOrder.filters.status.labelOrder")}
        required
      >
        <MultiComboBox onSelectionChange={onFilterChange} id="orderStatus"
                       valueState={filtersValueState.orderTypes}
                       valueStateMessage={<Text>{filtersValueState.orderTypesDesc}</Text>}>
          {toolbarFilters.orderStatus.map((row) => {
            return (
              <MultiComboBoxItem
                text={row.text}
                selected={row.selected}
                key={row.code}
                id={row.code}
              />
            );
          })}
        </MultiComboBox>
      </FilterGroupItem>
      {toolbarFilters.orderStatus.find(
        (row) => row.code == STATUS.RELEASED && row.selected == true
      ) && (
        <FilterGroupItem
          active
          label={getI18nText("transportOrder.filters.releaseDate.label")}
          required
        >
          <DatePicker
            hideWeekNumbers={true}
            formatPattern="dd.MM.yyyy"
            onChange={(e) => {
              let newFilterValues = {
                ...toolbarFilters,
                releaseDateFrom: e.detail.value,
              };
              dispatch(toolbarFiltersAction(newFilterValues));

              // Actualiza el estado de los campos
              let newFiltersValueState={...filtersValueState}
              let fieldDesc=e.target.id+"Desc"
              if(e.detail.value.length==0)
              {
                newFiltersValueState[e.target.id]=ValueState.Error          
                newFiltersValueState[fieldDesc]=getI18nText("transportOrder.filters.validations.fieldMandatory")
              }
              else{
                newFiltersValueState[e.target.id]=ValueState.None
                newFiltersValueState[fieldDesc]=""
              }
              setFiltersValueState(newFiltersValueState)
            }}
            value={toolbarFilters.releaseDateFrom}
          />
        </FilterGroupItem>
      )}
    </FilterBar>
  );
}
