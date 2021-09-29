// React Component for displaying an Industry's overview information
// (top-left panel in the Industry UI)
import React from "react";

import { OfficeSpace } from "../OfficeSpace";
import { Industries } from "../IndustryData";
import { IndustryUpgrades } from "../IndustryUpgrades";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { createProgressBarText } from "../../utils/helpers/createProgressBarText";
import { MakeProductPopup } from "./MakeProductPopup";
import { ResearchPopup } from "./ResearchPopup";
import { createPopup } from "../../ui/React/createPopup";
import { Money } from "../../ui/React/Money";
import { MoneyCost } from "./MoneyCost";
import { useCorporation, useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";

interface IProps {
  currentCity: string;
  office: OfficeSpace;
  rerender: () => void;
}

export function IndustryOverview(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  function renderMakeProductButton(): React.ReactElement {
    let createProductButtonText = "";
    let createProductPopupText = "";
    switch (division.type) {
      case Industries.Food:
        createProductButtonText = "Build Restaurant";
        createProductPopupText = "Build and manage a new restaurant!";
        break;
      case Industries.Tobacco:
        createProductButtonText = "Create Product";
        createProductPopupText = "Create a new tobacco product!";
        break;
      case Industries.Pharmaceutical:
        createProductButtonText = "Create Drug";
        createProductPopupText = "Design and develop a new pharmaceutical drug!";
        break;
      case Industries.Computer:
      case "Computer":
        createProductButtonText = "Create Product";
        createProductPopupText = "Design and manufacture a new computer hardware product!";
        break;
      case Industries.Robotics:
        createProductButtonText = "Design Robot";
        createProductPopupText = "Design and create a new robot or robotic system!";
        break;
      case Industries.Software:
        createProductButtonText = "Develop Software";
        createProductPopupText = "Develop a new piece of software!";
        break;
      case Industries.Healthcare:
        createProductButtonText = "Build Hospital";
        createProductPopupText = "Build and manage a new hospital!";
        break;
      case Industries.RealEstate:
        createProductButtonText = "Develop Property";
        createProductPopupText = "Develop a new piece of real estate property!";
        break;
      default:
        createProductButtonText = "Create Product";
        createProductPopupText = "Create a new product!";
        return <></>;
    }
    createProductPopupText +=
      "<br><br>To begin developing a product, " +
      "first choose the city in which it will be designed. The stats of your employees " +
      "in the selected city affect the properties of the finished product, such as its " +
      "quality, performance, and durability.<br><br>" +
      "You can also choose to invest money in the design and marketing of " +
      "the product. Investing money in its design will result in a superior product. " +
      "Investing money in marketing the product will help the product's sales.";

    const hasMaxProducts = division.hasMaximumNumberProducts();

    function openMakeProductPopup(): void {
      const popupId = "cmpy-mgmt-create-product-popup";
      createPopup(popupId, MakeProductPopup, {
        popupText: createProductPopupText,
        division: division,
        corp: corp,
        popupId: popupId,
      });
    }

    function shouldFlash(): boolean {
      return Object.keys(division.products).length === 0;
    }

    return (
      <Tooltip
        title={
          hasMaxProducts ? (
            <Typography>
              ou have reached the maximum number of products: {division.getMaximumNumberProducts()}
            </Typography>
          ) : (
            ""
          )
        }
      >
        <Button color={shouldFlash() ? "error" : "primary"} onClick={openMakeProductPopup} disabled={corp.funds.lt(0)}>
          {createProductButtonText}
        </Button>
      </Tooltip>
    );
  }

  function renderText(): React.ReactElement {
    const vechain = corp.unlockUpgrades[4] === 1;
    const profit = division.lastCycleRevenue.minus(division.lastCycleExpenses).toNumber();

    let advertisingInfo = false;
    const advertisingFactors = division.getAdvertisingFactors();
    const awarenessFac = advertisingFactors[1];
    const popularityFac = advertisingFactors[2];
    const ratioFac = advertisingFactors[3];
    const totalAdvertisingFac = advertisingFactors[0];
    if (vechain) {
      advertisingInfo = true;
    }

    function productionMultHelpTipOnClick(): void {
      // Wrapper for createProgressBarText()
      // Converts the industry's "effectiveness factors"
      // into a graphic (string) depicting how high that effectiveness is
      function convertEffectFacToGraphic(fac: number): string {
        return createProgressBarText({
          progress: fac,
          totalTicks: 20,
        });
      }

      dialogBoxCreate(
        "Owning Hardware, Robots, AI Cores, and Real Estate " +
          "can boost your Industry's production. The effect these " +
          "materials have on your production varies between Industries. " +
          "For example, Real Estate may be very effective for some Industries, " +
          "but ineffective for others.<br><br>" +
          "This division's production multiplier is calculated by summing " +
          "the individual production multiplier of each of its office locations. " +
          "This production multiplier is applied to each office. Therefore, it is " +
          "beneficial to expand into new cities as this can greatly increase the " +
          "production multiplier of your entire Division.<br><br>" +
          "Below are approximations for how effective each material is at boosting " +
          "this industry's production multiplier (Bigger bars = more effective):<br><br>" +
          `Hardware:&nbsp;&nbsp;&nbsp; ${convertEffectFacToGraphic(division.hwFac)}<br>` +
          `Robots:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${convertEffectFacToGraphic(division.robFac)}<br>` +
          `AI Cores:&nbsp;&nbsp;&nbsp; ${convertEffectFacToGraphic(division.aiFac)}<br>` +
          `Real Estate: ${convertEffectFacToGraphic(division.reFac)}`,
      );
    }

    function openResearchPopup(): void {
      const popupId = "corporation-research-popup-box";
      createPopup(popupId, ResearchPopup, {
        industry: division,
        popupId: popupId,
      });
    }

    return (
      <div>
        <Typography>
          Industry: {division.type} (Corp Funds: <Money money={corp.funds.toNumber()} />)
          <br /> <br />
          Awareness: {numeralWrapper.format(division.awareness, "0.000")} <br />
          Popularity: {numeralWrapper.format(division.popularity, "0.000")} <br />
          {advertisingInfo !== false && (
            <p className={"tooltip"}>
              Advertising Multiplier: x{numeralWrapper.format(totalAdvertisingFac, "0.000")}
              <span className={"tooltiptext cmpy-mgmt-advertising-info"}>
                Total multiplier for this industrys sales due to its awareness and popularity
                <br />
                Awareness Bonus: x{numeralWrapper.format(Math.pow(awarenessFac, 0.85), "0.000")}
                <br />
                Popularity Bonus: x{numeralWrapper.format(Math.pow(popularityFac, 0.85), "0.000")}
                <br />
                Ratio Multiplier: x{numeralWrapper.format(Math.pow(ratioFac, 0.85), "0.000")}
              </span>
            </p>
          )}
          {advertisingInfo}
        </Typography>
        <br />
        <br />
        <table>
          <tbody>
            <tr>
              <td>
                <p>Revenue: </p>
              </td>
              <td>
                <p>
                  <Money money={division.lastCycleRevenue.toNumber()} /> / s
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Expenses: </p>
              </td>
              <td>
                <p>
                  <Money money={division.lastCycleExpenses.toNumber()} /> / s
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Profit: </p>
              </td>
              <td>
                <p>
                  <Money money={profit} /> / s
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <p className={"tooltip"}>
          Production Multiplier: {numeralWrapper.format(division.prodMult, "0.00")}
          <span className={"tooltiptext"}>
            Production gain from owning production-boosting materials such as hardware, Robots, AI Cores, and Real
            Estate
          </span>
        </p>
        <div className={"help-tip"} onClick={productionMultHelpTipOnClick}>
          ?
        </div>
        <br /> <br />
        <p className={"tooltip"}>
          Scientific Research: {numeralWrapper.format(division.sciResearch.qty, "0.000a")}
          <span className={"tooltiptext"}>
            Scientific Research increases the quality of the materials and products that you produce.
          </span>
        </p>
        <button className={"help-tip"} onClick={openResearchPopup}>
          Research
        </button>
      </div>
    );
  }

  function renderUpgrades(): React.ReactElement[] {
    const upgrades = [];
    for (const index in IndustryUpgrades) {
      const upgrade = IndustryUpgrades[index];

      // AutoBrew research disables the Coffee upgrade
      if (division.hasResearch("AutoBrew") && upgrade[4] === "Coffee") {
        continue;
      }

      const i = upgrade[0];
      const baseCost = upgrade[1];
      const priceMult = upgrade[2];
      let cost = 0;
      switch (i) {
        case 0: //Coffee, cost is static per employee
          cost = props.office.employees.length * baseCost;
          break;
        default:
          cost = baseCost * Math.pow(priceMult, division.upgrades[i]);
          break;
      }

      function onClick(): void {
        if (corp.funds.lt(cost)) return;
        corp.funds = corp.funds.minus(cost);
        division.upgrade(upgrade, {
          corporation: corp,
          office: props.office,
        });
        props.rerender();
      }

      upgrades.push(
        renderUpgrade({
          key: index,
          onClick: onClick,
          text: (
            <>
              {upgrade[4]} - <MoneyCost money={cost} corp={corp} />
            </>
          ),
          tooltip: upgrade[5],
        }),
      );
    }

    return upgrades;
  }

  interface IRenderUpgradeProps {
    key: string;
    onClick: () => void;
    text: JSX.Element;
    tooltip: string;
  }

  function renderUpgrade(props: IRenderUpgradeProps): React.ReactElement {
    return (
      <div className={"cmpy-mgmt-upgrade-div tooltip"} onClick={props.onClick} key={props.key}>
        {props.text}
        {props.tooltip != null && <span className={"tooltiptext"}>{props.tooltip}</span>}
      </div>
    );
  }

  const makeProductButton = renderMakeProductButton();

  return (
    <Paper>
      {renderText()}
      <br />
      <Typography>Purchases & Upgrades</Typography>
      {renderUpgrades()} <br />
      {division.makesProducts && makeProductButton}
    </Paper>
  );
}
