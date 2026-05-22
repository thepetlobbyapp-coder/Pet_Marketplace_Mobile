from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "status-mvp-2-paginas-2026-05-19.pdf"
LOGO = ROOT / "docs" / "assets" / "pet-lobby-paw-marker-logo.png"

BRAND_DARK = colors.HexColor("#2A0A57")
BRAND = colors.HexColor("#5B22D6")
BRAND_SOFT = colors.HexColor("#F7F3FF")
BRAND_LINE = colors.HexColor("#DCCEFF")
INK = colors.HexColor("#252436")
MUTED = colors.HexColor("#636174")
BORDER = colors.HexColor("#E8E6F0")
ROW_ALT = colors.HexColor("#FBFAFE")
GREEN = colors.HexColor("#1F8A5B")
AMBER = colors.HexColor("#B26B00")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="BrandTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=BRAND_DARK,
        spaceAfter=1,
    )
)
styles.add(
    ParagraphStyle(
        name="Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.2,
        leading=12,
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
        spaceBefore=4,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=11.4,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=9.8,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="TableHead",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=7.9,
        leading=9.8,
        textColor=BRAND_DARK,
    )
)
styles.add(
    ParagraphStyle(
        name="Strong",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8.6,
        leading=10.8,
        textColor=BRAND_DARK,
    )
)
styles.add(
    ParagraphStyle(
        name="Metric",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=27,
        leading=30,
        textColor=BRAND,
        alignment=1,
    )
)
styles.add(
    ParagraphStyle(
        name="MetricLabel",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8.3,
        leading=10.2,
        textColor=BRAND_DARK,
        alignment=1,
    )
)


def p(text, style="Body"):
    return Paragraph(text, styles[style])


def header():
    block = Table(
        [
            [
                Image(str(LOGO), width=23 * mm, height=23 * mm),
                [
                    p("THE PET LOBBY", "BrandTitle"),
                    p("Status do MVP - visao executiva em 2 paginas", "Subtitle"),
                    p("Your pet. Your services. Your community.", "Subtitle"),
                ],
            ]
        ],
        colWidths=[30 * mm, 137 * mm],
    )
    block.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    return block


def metric_card(label, value, color=BRAND):
    style_name = f"Metric_{label}".replace(" ", "_").replace("/", "_")
    if style_name not in styles:
        styles.add(
            ParagraphStyle(
                name=style_name,
                parent=styles["Metric"],
                textColor=color,
            )
        )
    card = Table(
        [[p(value, style_name)], [p(label, "MetricLabel")]],
        colWidths=[39.5 * mm],
        rowHeights=[14 * mm, 8 * mm],
    )
    card.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), BRAND_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.45, BRAND_LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return card


def metrics():
    table = Table(
        [
            [
                metric_card("MVP geral", "43%"),
                metric_card("Backend/API", "60%", GREEN),
                metric_card("Banco", "65%", GREEN),
                metric_card("Mobile", "30%", AMBER),
            ]
        ],
        colWidths=[41.75 * mm] * 4,
    )
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    return table


def status_table():
    rows = [
        [p("Ambiente", "TableHead"), p("Conclusao", "TableHead"), p("O que ja temos pronto", "TableHead")],
        [
            p("Backend/API", "Strong"),
            p("60%", "Strong"),
            p("NestJS, health publico em DigitalOcean, Supabase, auth/RBAC base, `/me`, logging/erros, testes e smokes principais.", "Body"),
        ],
        [
            p("Banco/Supabase", "Strong"),
            p("65%", "Strong"),
            p("PostGIS, pgcrypto, tabelas base, RLS ativo, smoke read-only e sincronizacao de usuario autenticado.", "Body"),
        ],
        [
            p("Mobile Android", "Strong"),
            p("30%", "Strong"),
            p("Base Expo em branch mobile, validacoes passando, S1/S2 de permissoes e HTTPS/cleartext endurecidos, SDK/emulador preparado.", "Body"),
        ],
        [
            p("Admin Web", "Strong"),
            p("25%", "Strong"),
            p("Base TypeScript de auth/session, contratos, dashboard/listas/tabelas e testes locais. Ainda nao e painel Next.js real.", "Body"),
        ],
        [
            p("Infra/Deploy", "Strong"),
            p("60%", "Strong"),
            p("Backend online na DigitalOcean com health 200, variaveis principais aplicadas e hotfix persistido no repo correto.", "Body"),
        ],
        [
            p("Play Store", "Strong"),
            p("30%", "Strong"),
            p("Permissoes e cleartext documentados e endurecidos. Faltam artefato EAS/AAB, politicas e revisao final.", "Body"),
        ],
        [
            p("Docs/Governanca", "Strong"),
            p("85%", "Strong"),
            p("Documentacao tecnica, checkpoints, regras de cascata e status de progresso bem mantidos.", "Body"),
        ],
    ]
    table = Table(rows, colWidths=[31 * mm, 22 * mm, 114 * mm], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_SOFT),
                ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
                ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
                ("BACKGROUND", (0, 6), (-1, 6), ROW_ALT),
                ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4.6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4.6),
            ]
        )
    )
    return table


def missing_table():
    rows = [
        [p("Frente", "TableHead"), p("O que falta para MVP", "TableHead")],
        [p("Mobile", "Strong"), p("Login real, logout, token seguro, estados 401/403/offline, navegacao, pets, busca, agendamentos e chat texto.", "Body")],
        [p("Backend/API", "Strong"), p("Perfis completos, pets, servicos, busca por localizacao, disponibilidade, bookings, chat, avaliacoes e denuncias.", "Body")],
        [p("Banco", "Strong"), p("Policies por fluxo real, seeds controladas e tabelas/regras finais para disponibilidade, bookings, chat e reports.", "Body")],
        [p("Admin", "Strong"), p("Painel web real com login admin, dashboard, listagens, detalhe de usuario/prestador e moderacao minima.", "Body")],
        [p("Infra", "Strong"), p("CORS_ALLOWED_ORIGINS, remotes locais corretos, pipeline por app e deploys repetiveis.", "Body")],
        [p("Android/Loja", "Strong"), p("Smoke visual completo, EAS/AAB, targetSdk provado no artefato, privacidade, exclusao de conta, Data Safety e App Access.", "Body")],
    ]
    table = Table(rows, colWidths=[33 * mm, 134 * mm], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_SOFT),
                ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
                ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
                ("BACKGROUND", (0, 6), (-1, 6), ROW_ALT),
                ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5.5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5.5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def next_steps():
    rows = [
        [p("1", "Strong"), p("Fechar smoke real do Mobile instalado: abre, nao crasha, tela inicial carrega e logs sem erro fatal.", "Body")],
        [p("2", "Strong"), p("Provar build Android de release via EAS quando conta e configuracao estiverem prontas.", "Body")],
        [p("3", "Strong"), p("Iniciar Mobile Auth real: login, logout, token seguro, estados de erro e App Access.", "Body")],
        [p("4", "Strong"), p("Implementar os fluxos centrais: perfil, pets, busca, disponibilidade, agendamento e chat texto.", "Body")],
        [p("5", "Strong"), p("Transformar Admin em painel real depois que Backend/Mobile tiverem contratos estaveis.", "Body")],
    ]
    table = Table(rows, colWidths=[11 * mm, 156 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), BRAND_SOFT),
                ("GRID", (0, 0), (-1, -1), 0.3, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4.2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4.2),
            ]
        )
    )
    return table


def callout(text):
    table = Table([[p(text, "Small")]], colWidths=[167 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), BRAND_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.45, BRAND_LINE),
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
        topMargin=14 * mm,
        bottomMargin=13 * mm,
        title="The Pet Lobby - Status do MVP em 2 paginas",
        author="The Pet Lobby",
    )
    story = []

    story.append(header())
    story.append(Spacer(1, 6 * mm))
    story.append(metrics())
    story.append(Spacer(1, 5 * mm))
    story.append(p("Pagina 1 - Percentual por ambiente", "Section"))
    story.append(
        p(
            "O percentual mede proximidade de um MVP funcional, nao apenas volume de codigo. Por isso Mobile, fluxos de marketplace e gates de loja pesam bastante.",
            "Body",
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(status_table())
    story.append(Spacer(1, 5 * mm))
    story.append(
        callout(
            "Leitura rapida: a fundacao tecnica e real. Backend e Banco estao acima da metade do caminho; o maior gargalo agora e transformar isso em experiencia navegavel no Mobile e operacao minima no Admin."
        )
    )

    story.append(PageBreak())

    story.append(header())
    story.append(Spacer(1, 6 * mm))
    story.append(p("Pagina 2 - O que falta para o MVP", "Section"))
    story.append(missing_table())
    story.append(Spacer(1, 5 * mm))
    story.append(p("Ordem natural recomendada", "Section"))
    story.append(next_steps())
    story.append(Spacer(1, 5 * mm))
    story.append(p("Veredito executivo", "Section"))
    story.append(
        callout(
            "<b>Status atual:</b> em progresso consistente, com base tecnica forte. <b>Risco principal:</b> ainda falta produto navegavel de ponta a ponta no Mobile. <b>Proximo marco:</b> Mobile autenticando no Backend e exibindo estado real do usuario."
        )
    )

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()

