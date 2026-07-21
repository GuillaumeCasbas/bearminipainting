import { CreateProjetUseCase } from "../../../src/core/usecases/create-projet.usecase";
import { ProjetRepository } from "../../../src/core/ports/projet.repository";
import { Projet } from "../../../src/core/entities/Projet";
import { CodeNotUniqueError } from "../../../src/core/errors/projet.errors";

describe("CreateProjetUseCase", () => {
  const mockRepository: ProjetRepository = {
    findByCode: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
  };

  const useCase = new CreateProjetUseCase(mockRepository);

  it("should throw CodeNotUniqueError if the code is already used", async () => {
    const existingProjet = new Projet("1", "Space Marines", "NMS");
    (mockRepository.findByCode as jest.Mock).mockResolvedValue(existingProjet);

    await expect(useCase.execute("New Project", "NMS"))
      .rejects
      .toBeInstanceOf(CodeNotUniqueError);
  });

  it("should create a project if the code is unique", async () => {
    (mockRepository.findByCode as jest.Mock).mockResolvedValue(null);
    (mockRepository.save as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute("New Project", "UNIQUE");

    expect(result).toBeInstanceOf(Projet);
    expect(result.nom).toBe("New Project");
    expect(result.code).toBe("UNIQUE");
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
