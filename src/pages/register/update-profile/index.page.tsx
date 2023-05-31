import { z } from "zod"
import { GetServerSideProps } from "next"
// import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { ArrowRight } from "phosphor-react"
import { getServerSession } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, MultiStep, Text, TextArea } from "@ignite-ui/react"

// import { api } from "../../lib/api"
import { buildNextAuthOptions } from "../../api/auth/[...nextauth].api"

import { ProfileBox, FormAnnotation } from "./styles"
import { Container, Header } from "../styles"
import { useSession } from "next-auth/react"

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })
  const session = useSession()
  console.log(session)

  async function handleUpdateProfile(data: UpdateProfileData) {}

  return (
    <Container>
      <Header>
        <Heading as="h1">Defina sua disponibilidade</Heading>
        <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text>Foto de perfil</Text>
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register("bio")} />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  )

  return {
    props: {
      session,
    },
  }
}
