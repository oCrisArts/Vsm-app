import svgPaths from "./svg-j07ux6d8bh";
import imgImageDominacaoAbsoluta from "figma:asset/9d0b0475eccd0337994da6766bb60e9be4982b13.png";
import imgImageArteDaConquista from "figma:asset/85bb2779d47fe59ded6690ec8da200446d0a5024.png";
import imgImagePsicologiaDark from "figma:asset/e5a64e3be5e34ec4cec4aa5c50b48f504b380c62.png";
import imgImageLinguagemCorporal from "figma:asset/337640c5cf08e0ad9c23e8ae900fd272e0d526d6.png";
import imgImageStorytellingAvancado from "figma:asset/a03b26e01c9e37942fa239356e6fab2f6c5e59cb.png";
import imgImageFrameControl from "figma:asset/a1d81e5262848e5e04280b59f72fc7b1f64f4009.png";
import imgImageAtracaoDeAltoValor from "figma:asset/1ef4b41b9a29b7b0c38daa419f9f81b4bbae7378.png";
import imgImageCalibracaoSocial from "figma:asset/d265452ca2c553032e02af622bb2c15f7446b618.png";

function Heading() {
  return (
    <div className="h-[35.985px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[36px] left-0 text-[30px] text-white top-[-1.11px]">Aprender</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Urbanist:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#999] text-[14px] top-[-0.89px]">Todos Os Cursos Disponíveis</p>
    </div>
  );
}

function Text() {
  return <div className="h-[23.003px] shrink-0 w-0" data-name="Text" />;
}

function Icon() {
  return (
    <div className="flex-[1_0_0] h-[19.992px] min-h-px min-w-px relative" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[12.5%_20.83%_20.83%_12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9938 14.9938">
              <path d={svgPaths.p2ad46b80} id="Vector" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[69.58%_12.5%_12.5%_69.58%]" data-name="Vector">
          <div className="absolute inset-[-23.26%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.24781 5.24781">
              <path d={svgPaths.p9f57c20} id="Vector" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function MuiInputAdornmentRoot() {
  return (
    <div className="absolute content-stretch flex h-[23.003px] items-center left-[13.99px] top-[13.97px] w-[19.992px]" data-name="MuiInputAdornmentRoot">
      <Text />
      <Icon />
    </div>
  );
}

function MuiOutlinedInputInput() {
  return (
    <div className="absolute content-stretch flex h-[50.957px] items-center left-[41.97px] overflow-clip p-[14px] top-0 w-[286.686px]" data-name="MuiOutlinedInputInput">
      <p className="font-['Urbanist:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white tracking-[0.1501px]">Buscar cursos...</p>
    </div>
  );
}

function MuiNotchedOutlined() {
  return <div className="absolute border-[#1a1a1a] border-[1.108px] border-solid h-[55.942px] left-0 rounded-[12px] top-[-4.98px] w-[328.66px]" data-name="MuiNotchedOutlined" />;
}

function MuiOutlinedInputRoot() {
  return (
    <div className="absolute bg-[#0a0a0a] h-[50.957px] left-0 rounded-[12px] top-0 w-[328.66px]" data-name="MuiOutlinedInputRoot">
      <MuiInputAdornmentRoot />
      <MuiOutlinedInputInput />
      <MuiNotchedOutlined />
    </div>
  );
}

function MuiFormControlRoot() {
  return (
    <div className="h-[50.957px] relative shrink-0 w-full" data-name="MuiFormControlRoot">
      <MuiOutlinedInputRoot />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#0a1a3a] gap-[3.998px] h-[158.912px] items-start left-0 pt-[23.99px] px-[23.99px] to-black top-[55.99px] w-[376.64px]" data-name="Container">
      <Heading />
      <Paragraph />
      <MuiFormControlRoot />
    </div>
  );
}

function ImageDominacaoAbsoluta() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Dominação Absoluta)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageDominacaoAbsoluta} />
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Controle Total</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[59.992px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[30px] left-0 text-[24px] text-white top-0 w-[124px] whitespace-pre-wrap">Dominação Absoluta</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[171.928px] items-start left-0 pt-[15.993px] px-[15.993px] top-[278.55px] w-[253.401px]" data-name="Container">
      <Paragraph1 />
      <Heading1 />
      <Container5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageDominacaoAbsoluta />
      <Container3 />
      <Container4 />
    </div>
  );
}

function MuiPaperRoot() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container2 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImageArteDaConquista() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Arte da Conquista)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageArteDaConquista} />
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Sedução Refinada</p>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex h-[29.996px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Urbanist:Black',sans-serif] font-black leading-[30px] min-h-px min-w-px relative text-[24px] text-white whitespace-pre-wrap">Arte da Conquista</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[141.932px] items-start left-0 pt-[15.993px] px-[15.993px] top-[308.55px] w-[253.401px]" data-name="Container">
      <Paragraph2 />
      <Heading2 />
      <Container9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageArteDaConquista />
      <Container7 />
      <Container8 />
    </div>
  );
}

function MuiPaperRoot1() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container6 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImagePsicologiaDark() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Psicologia Dark)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImagePsicologiaDark} />
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph3() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Manipulação Ética</p>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex h-[29.996px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Urbanist:Black',sans-serif] font-black leading-[30px] min-h-px min-w-px relative text-[24px] text-white whitespace-pre-wrap">Psicologia Dark</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[141.932px] items-start left-0 pt-[15.993px] px-[15.993px] top-[308.55px] w-[253.401px]" data-name="Container">
      <Paragraph3 />
      <Heading3 />
      <Container13 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImagePsicologiaDark />
      <Container11 />
      <Container12 />
    </div>
  );
}

function MuiPaperRoot2() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container10 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImageLinguagemCorporal() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Linguagem Corporal)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageLinguagemCorporal} />
    </div>
  );
}

function Container15() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph4() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Presença Alpha</p>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[59.992px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[30px] left-0 text-[24px] text-white top-0 w-[124px] whitespace-pre-wrap">Linguagem Corporal</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[171.928px] items-start left-0 pt-[15.993px] px-[15.993px] top-[278.55px] w-[253.401px]" data-name="Container">
      <Paragraph4 />
      <Heading4 />
      <Container17 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageLinguagemCorporal />
      <Container15 />
      <Container16 />
    </div>
  );
}

function MuiPaperRoot3() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container14 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImageStorytellingAvancado() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Storytelling Avançado)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageStorytellingAvancado} />
    </div>
  );
}

function Container19() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph5() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Narrativas Poderosas</p>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[59.992px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[30px] left-0 text-[24px] text-white top-0 w-[129px] whitespace-pre-wrap">Storytelling Avançado</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[171.928px] items-start left-0 pt-[15.993px] px-[15.993px] top-[278.55px] w-[253.401px]" data-name="Container">
      <Paragraph5 />
      <Heading5 />
      <Container21 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageStorytellingAvancado />
      <Container19 />
      <Container20 />
    </div>
  );
}

function MuiPaperRoot4() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container18 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImageFrameControl() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Frame Control)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageFrameControl} />
    </div>
  );
}

function Container23() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph6() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Domínio de Situações</p>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex h-[29.996px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Urbanist:Black',sans-serif] font-black leading-[30px] min-h-px min-w-px relative text-[24px] text-white whitespace-pre-wrap">Frame Control</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[141.932px] items-start left-0 pt-[15.993px] px-[15.993px] top-[308.55px] w-[253.401px]" data-name="Container">
      <Paragraph6 />
      <Heading6 />
      <Container25 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageFrameControl />
      <Container23 />
      <Container24 />
    </div>
  );
}

function MuiPaperRoot5() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container22 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImageAtracaoDeAltoValor() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Atração de Alto Valor)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAtracaoDeAltoValor} />
    </div>
  );
}

function Container27() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph7() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Magnetismo Pessoal</p>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[59.992px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[30px] left-0 text-[24px] text-white top-0 w-[175px] whitespace-pre-wrap">Atração de Alto Valor</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[171.928px] items-start left-0 pt-[15.993px] px-[15.993px] top-[278.55px] w-[253.401px]" data-name="Container">
      <Paragraph7 />
      <Heading7 />
      <Container29 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageAtracaoDeAltoValor />
      <Container27 />
      <Container28 />
    </div>
  );
}

function MuiPaperRoot6() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container26 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function ImageCalibracaoSocial() {
  return (
    <div className="absolute h-[450.479px] left-0 top-0 w-[253.401px]" data-name="Image (Calibração Social)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageCalibracaoSocial} />
    </div>
  );
}

function Container31() {
  return <div className="absolute bg-gradient-to-t from-black h-[450.479px] left-0 to-[rgba(0,0,0,0.2)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[253.401px]" data-name="Container" />;
}

function Paragraph8() {
  return (
    <div className="content-stretch flex h-[15.993px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[16px] min-h-px min-w-px relative text-[#4169ff] text-[12px] whitespace-pre-wrap">Inteligência de Campo</p>
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex h-[29.996px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Urbanist:Black',sans-serif] font-black leading-[30px] min-h-px min-w-px relative text-[24px] text-white whitespace-pre-wrap">Calibração Social</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[39.966px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Urbanist:ExtraBold',sans-serif] font-extrabold leading-[20px] left-[110.92px] text-[14px] text-center text-white top-[9.09px]">Iniciar</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.998px] h-[141.932px] items-start left-0 pt-[15.993px] px-[15.993px] top-[308.55px] w-[253.401px]" data-name="Container">
      <Paragraph8 />
      <Heading8 />
      <Container33 />
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[450.479px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageCalibracaoSocial />
      <Container31 />
      <Container32 />
    </div>
  );
}

function MuiPaperRoot7() {
  return (
    <div className="bg-[#0a0a0a] h-[452.695px] relative rounded-[16px] shrink-0 w-[255.616px]" data-name="MuiPaperRoot">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[1.108px] relative rounded-[inherit] size-full">
        <Container30 />
      </div>
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[15.993px] h-[468.688px] items-start left-[15.99px] overflow-clip top-[214.91px] w-[344.653px]" data-name="Container">
      <MuiPaperRoot />
      <MuiPaperRoot1 />
      <MuiPaperRoot2 />
      <MuiPaperRoot3 />
      <MuiPaperRoot4 />
      <MuiPaperRoot5 />
      <MuiPaperRoot6 />
      <MuiPaperRoot7 />
    </div>
  );
}

function Ty() {
  return (
    <div className="bg-black h-[971.855px] relative shrink-0 w-full" data-name="TY">
      <Container />
      <Container1 />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[851.87px] items-start left-0 top-0 w-[376.64px]" data-name="Body">
      <Ty />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[16.097px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Urbanist:Black',sans-serif] font-black leading-[16px] relative shrink-0 text-[12px] text-white">CS</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[#4169ff] relative rounded-[10px] shrink-0 size-[31.987px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-[62.779px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[24px] left-0 text-[#4169ff] text-[16px] top-[-1.89px]">CÓDIGO</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-[100.53px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Urbanist:Black',sans-serif] font-black leading-[24px] left-0 text-[16px] text-white top-[-1.89px]">DA SEDUÇÃO</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-[165.299px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[1.991px] items-start relative size-full">
        <Text2 />
        <Text3 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[31.987px] relative shrink-0 w-[205.282px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[13.189px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Urbanist:Black',sans-serif] font-black leading-[16px] relative shrink-0 text-[12px] text-center text-white">JS</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#4169ff] items-center justify-center left-[47.98px] pl-[1.108px] pr-[1.125px] py-[1.108px] rounded-[37170400px] size-[35.985px] to-[#2845aa] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.108px] border-[rgba(65,105,255,0.5)] border-solid inset-0 pointer-events-none rounded-[37170400px]" />
      <Text4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[8.88px] size-[15.993px] top-[8.88px]" data-name="Icon">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g clipPath="url(#clip0_29_1374)" id="Icon">
          <path d={svgPaths.p7daba00} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p1d2e5f80} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
        <defs>
          <clipPath id="clip0_29_1374">
            <rect fill="white" height="15.9933" width="15.9933" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text5() {
  return <div className="absolute bg-[#4169ff] border-[1.108px] border-black border-solid left-[21.79px] rounded-[37170400px] size-[9.987px] top-[1.99px]" data-name="Text" />;
}

function Button1() {
  return (
    <div className="absolute bg-[#0a0a0a] border-[#1a1a1a] border-[1.108px] border-solid left-0 rounded-[37170400px] size-[35.985px] top-0" data-name="Button">
      <Icon1 />
      <Text5 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[35.985px] relative shrink-0 w-[83.965px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.9)] content-stretch flex h-[61.083px] items-center justify-between left-0 pb-[1.108px] px-[19.992px] top-0 w-[376.64px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-b-[1.108px] border-solid inset-0 pointer-events-none" />
      <Container35 />
      <Container38 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[21.999px]" data-name="Icon">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9995 21.9995">
        <g clipPath="url(#clip0_29_1367)" id="Icon">
          <path d={svgPaths.p1e9df771} id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M18.3329 2.74994V6.41652" id="Vector_2" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M20.1662 4.58323H16.4996" id="Vector_3" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M3.66658 15.583V17.4163" id="Vector_4" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M4.58323 16.4996H2.74994" id="Vector_5" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
        </g>
        <defs>
          <clipPath id="clip0_29_1367">
            <rect fill="white" height="21.9995" width="21.9995" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MuiBottomNavigationActionLabel() {
  return (
    <div className="h-[13.501px] relative shrink-0 w-[32.817px]" data-name="MuiBottomNavigationActionLabel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Black',sans-serif] font-black leading-[13.5px] left-[16.5px] text-[#444] text-[9px] text-center top-[0.11px]">INICIAR</p>
      </div>
    </div>
  );
}

function MuiButtonBaseRoot() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.994px] h-[63.991px] items-center justify-center left-0 pb-[0.017px] top-0 w-[75.328px]" data-name="MuiButtonBaseRoot">
      <Icon2 />
      <MuiBottomNavigationActionLabel />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[26.66px] size-[21.999px] top-[12.74px]" data-name="Icon">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9995 21.9995">
        <g clipPath="url(#clip0_29_1378)" id="Icon">
          <path d="M10.9997 6.41652V19.2496" id="Vector" stroke="var(--stroke-0, #4169FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d={svgPaths.p246fa3f0} id="Vector_2" stroke="var(--stroke-0, #4169FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
        </g>
        <defs>
          <clipPath id="clip0_29_1378">
            <rect fill="white" height="21.9995" width="21.9995" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MuiBottomNavigationActionLabel1() {
  return (
    <div className="absolute h-[13.501px] left-[15.2px] top-[37.73px] w-[44.934px]" data-name="MuiBottomNavigationActionLabel">
      <p className="-translate-x-1/2 absolute font-['Urbanist:Black',sans-serif] font-black leading-[13.5px] left-[22.5px] text-[#4169ff] text-[9px] text-center top-[0.11px]">APRENDER</p>
    </div>
  );
}

function MuiTouchRippleRoot() {
  return <div className="absolute h-[63.991px] left-0 top-0 w-[75.328px]" data-name="MuiTouchRippleRoot" />;
}

function MuiButtonBaseRoot1() {
  return (
    <div className="absolute h-[63.991px] left-[75.33px] top-0 w-[75.328px]" data-name="MuiButtonBaseRoot">
      <Icon3 />
      <MuiBottomNavigationActionLabel1 />
      <MuiTouchRippleRoot />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[21.999px]" data-name="Icon">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9995 21.9995">
        <g clipPath="url(#clip0_29_1382)" id="Icon">
          <path d={svgPaths.p2d84cf00} id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d={svgPaths.p389f9a00} id="Vector_2" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
        </g>
        <defs>
          <clipPath id="clip0_29_1382">
            <rect fill="white" height="21.9995" width="21.9995" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MuiBottomNavigationActionLabel2() {
  return (
    <div className="h-[13.501px] relative shrink-0 w-[37.751px]" data-name="MuiBottomNavigationActionLabel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Black',sans-serif] font-black leading-[13.5px] left-[19px] text-[#444] text-[9px] text-center top-[0.11px]">EVOLUIR</p>
      </div>
    </div>
  );
}

function MuiButtonBaseRoot2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.994px] h-[63.991px] items-center justify-center left-[150.66px] pb-[0.017px] top-0 w-[75.328px]" data-name="MuiButtonBaseRoot">
      <Icon4 />
      <MuiBottomNavigationActionLabel2 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[21.999px]" data-name="Icon">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9995 21.9995">
        <g clipPath="url(#clip0_29_1361)" id="Icon">
          <path d="M7.33317 1.83329V5.49987" id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M14.6663 1.83329V5.49987" id="Vector_2" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d={svgPaths.p38fe5d00} id="Vector_3" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M2.74994 9.16646H19.2496" id="Vector_4" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
        </g>
        <defs>
          <clipPath id="clip0_29_1361">
            <rect fill="white" height="21.9995" width="21.9995" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MuiBottomNavigationActionLabel3() {
  return (
    <div className="h-[13.501px] relative shrink-0 w-[42.078px]" data-name="MuiBottomNavigationActionLabel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Black',sans-serif] font-black leading-[13.5px] left-[21.5px] text-[#444] text-[9px] text-center top-[0.11px]">AGENDAR</p>
      </div>
    </div>
  );
}

function MuiButtonBaseRoot3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.994px] h-[63.991px] items-center justify-center left-[225.98px] pb-[0.017px] top-0 w-[75.328px]" data-name="MuiButtonBaseRoot">
      <Icon5 />
      <MuiBottomNavigationActionLabel3 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[21.999px]" data-name="Icon">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9995 21.9995">
        <g id="Icon">
          <path d={svgPaths.p2e8faf00} id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M10.9997 5.49987V18.3329" id="Vector_2" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M7.33317 7.33317V18.3329" id="Vector_3" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
          <path d="M3.66658 3.66658V18.3329" id="Vector_4" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83329" />
        </g>
      </svg>
    </div>
  );
}

function MuiBottomNavigationActionLabel4() {
  return (
    <div className="h-[13.501px] relative shrink-0 w-[52.117px]" data-name="MuiBottomNavigationActionLabel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Black',sans-serif] font-black leading-[13.5px] left-[26.5px] text-[#444] text-[9px] text-center top-[0.11px]">CONSULTAR</p>
      </div>
    </div>
  );
}

function MuiButtonBaseRoot4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2.994px] h-[63.991px] items-center justify-center left-[301.31px] pb-[0.017px] top-0 w-[75.328px]" data-name="MuiButtonBaseRoot">
      <Icon6 />
      <MuiBottomNavigationActionLabel4 />
    </div>
  );
}

function MuiBottomNavigationRoot() {
  return (
    <div className="bg-[#0a0a0a] h-[63.991px] relative shrink-0 w-full" data-name="MuiBottomNavigationRoot">
      <MuiButtonBaseRoot />
      <MuiButtonBaseRoot1 />
      <MuiButtonBaseRoot2 />
      <MuiButtonBaseRoot3 />
      <MuiButtonBaseRoot4 />
    </div>
  );
}

function MuiPaperRoot8() {
  return (
    <div className="absolute bg-[#0a0a0a] content-stretch flex flex-col h-[65.098px] items-start left-0 pt-[1.108px] rounded-[4px] top-[786.77px] w-[376.64px]" data-name="MuiPaperRoot">
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-solid border-t-[1.108px] inset-0 pointer-events-none rounded-[4px] shadow-[0px_5px_5px_0px_rgba(0,0,0,0.2),0px_8px_10px_0px_rgba(0,0,0,0.14),0px_3px_14px_0px_rgba(0,0,0,0.12)]" />
      <MuiBottomNavigationRoot />
    </div>
  );
}

export default function SeductionTrainingAppDesign() {
  return (
    <div className="bg-white relative size-full" data-name="Seduction Training App Design">
      <Body />
      <Container34 />
      <MuiPaperRoot8 />
    </div>
  );
}