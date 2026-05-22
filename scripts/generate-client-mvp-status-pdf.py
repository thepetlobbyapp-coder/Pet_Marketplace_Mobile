from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "status-mvp-cliente-2026-05-19-validacao-assertiva.pdf"
LOGO = ROOT / "docs" / "assets" / "pet-lobby-paw-marker-logo.png"

BRAND_DARK = colors.HexColor("#2A0A57")
BRAND = colors.HexColor("#5B22D6")
BRAND_LIGHT = colors.HexColor("#F7F3FF")
NEUTRAL = colors.HexColor("#262638")
MUTED = colors.HexColor("#5C5C70")
BORDER = colors.HexColor("#E8E8EF")
ROW_ALT = colors.HexColor("#FAFAFC")


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="BrandTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=25,
        leading=29,
        textColor=BRAND_DARK,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=BRAND_DARK,
        spaceBefore=6,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=NEUTRAL,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.3,
        leading=10.5,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Metric",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=31,
        textColor=BRAND,
        alignment=1,
    )
)
styles.add(
    ParagraphStyle(
        name="MetricLabel",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=BRAND_DARK,
        alignment=1,
    )
)
styles.add(
    ParagraphStyle(
        name="CardTitle",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=9.8,
        leading=12.5,
        textColor=BRAND_DARK,
    )
)


def p(text, style="Body"):
    return Paragraph(text, styles[style])


def metric_card(title, value):
    card = Table(
        [[p(value, "Metric")], [p(title, "MetricLabel")]],
        colWidths=[39 * mm],
        rowHeights=[15 * mm, 9 * mm],
    )
    card.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), BRAND_LIGHT),
                ("BOX", (0, 0), (-1, -1), 0.45, colors.HexColor("#DCCEFF")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return card


def status_table():
    rows = [
        [p("<b>Frente</b>", "Small"), p("<b>Status para cliente</b>", "Small"), p("<b>Progresso</b>", "Small")],
        [
            p("Mobile", "CardTitle"),
            p("A identidade visual existe, mas o aplicativo ainda precisa ser iniciado.", "Body"),
            p("<b>5%</b>", "CardTitle"),
        ],
        [
            p("Back", "CardTitle"),
            p("A base principal está funcionando. Faltam os fluxos completos do marketplace.", "Body"),
            p("<b>35%</b>", "CardTitle"),
        ],
        [
            p("Banco", "CardTitle"),
            p("A estrutura inicial foi criada e conferida. Faltam partes dos fluxos finais.", "Body"),
            p("<b>50%</b>", "CardTitle"),
        ],
        [
            p("Admin", "CardTitle"),
            p("Há uma base inicial testada. Falta virar um painel web utilizável.", "Body"),
            p("<b>25%</b>", "CardTitle"),
        ],
        [
            p("Docs", "CardTitle"),
            p("Escopo, regras e visual estão bem definidos. Faltam textos finais de lançamento.", "Body"),
            p("<b>90%</b>", "CardTitle"),
        ],
    ]
    table = Table(rows, colWidths=[29 * mm, 116 * mm, 22 * mm], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_LIGHT),
                ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
                ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
                ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def next_steps_table():
    rows = [
        [p("1", "CardTitle"), p("Iniciar o aplicativo mobile e montar as primeiras telas reais.", "Body")],
        [p("2", "CardTitle"), p("Completar busca, agendamento, chat, avaliação e denúncia.", "Body")],
        [p("3", "CardTitle"), p("Transformar o Admin em painel web utilizável.", "Body")],
        [p("4", "CardTitle"), p("Fechar o ambiente online e validar acesso público.", "Body")],
        [p("5", "CardTitle"), p("Preparar revisão final e pacote de teste para Play Store.", "Body")],
    ]
    table = Table(rows, colWidths=[11 * mm, 156 * mm])
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.3, BORDER),
                ("BACKGROUND", (0, 0), (0, -1), BRAND_LIGHT),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def build():
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=15 * mm,
        bottomMargin=14 * mm,
        title="The Pet Lobby - Status do MVP",
        author="The Pet Lobby",
    )

    story = []

    header = Table(
        [
            [
                Image(str(LOGO), width=24 * mm, height=24 * mm),
                [
                    p("THE PET LOBBY", "BrandTitle"),
                    p("Status simples do MVP - validado em 19/05/2026", "Subtitle"),
                    p("Your pet. Your services. Your community.", "Subtitle"),
                ],
            ]
        ],
        colWidths=[31 * mm, 136 * mm],
    )
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(header)
    story.append(Spacer(1, 7 * mm))

    metrics = Table(
        [[metric_card("MVP geral", "33%"), metric_card("Docs", "90%"), metric_card("Banco", "50%"), metric_card("Mobile", "5%")]],
        colWidths=[41.75 * mm] * 4,
    )
    metrics.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(metrics)
    story.append(Spacer(1, 6 * mm))

    story.append(p("Leitura rápida", "Section"))
    story.append(
        p(
            "O projeto tem uma boa fundação: escopo, identidade visual, servidor e banco inicial. Ainda não está próximo de entrega funcional porque o aplicativo mobile, o painel Admin e os fluxos principais do marketplace precisam ser construídos.",
            "Body",
        )
    )
    story.append(Spacer(1, 5 * mm))

    story.append(p("Status por frente", "Section"))
    story.append(status_table())
    story.append(Spacer(1, 6 * mm))

    story.append(p("Próximos passos", "Section"))
    story.append(next_steps_table())
    story.append(Spacer(1, 5 * mm))

    note = Table(
        [
            [
                p(
                    "Observação: o percentual é uma estimativa ponderada do MVP funcional. A Fase 1 não inclui pagamento real.",
                    "Small",
                )
            ]
        ],
        colWidths=[167 * mm],
    )
    note.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.35, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(note)

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
